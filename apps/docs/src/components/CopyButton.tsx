import { useState } from 'react'
import { CopyIcon, CheckIcon } from '../icons'

export function CopyButton({ text, darkMode }: { text: string; darkMode: boolean }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      onClick={copy}
      className={`p-1 rounded transition-colors opacity-0 group-hover:opacity-100 ${
        copied
          ? 'text-green-500'
          : darkMode
          ? 'text-gray-500 hover:text-gray-300'
          : 'text-gray-400 hover:text-gray-700'
      }`}
      aria-label="Copy to clipboard"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  )
}
