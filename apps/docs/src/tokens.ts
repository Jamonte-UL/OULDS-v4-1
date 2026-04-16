import primitiveTokens from '@tokens/primitive.json'
import semanticTokens from '@tokens/semantic.json'
import componentTokens from '@tokens/component.json'

export { primitiveTokens, semanticTokens, componentTokens }

// Resolve alias like "{color.gray.700}" → "#3E3E3E"
export function resolveAlias(value: string): string {
  if (typeof value !== 'string') return String(value)
  const match = value.match(/^\{(.+)\}$/)
  if (!match) return value
  const path = match[1].split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let obj: any = primitiveTokens
  for (const key of path) {
    if (obj == null) return value
    obj = obj[key]
  }
  if (obj && typeof obj === 'object' && '$value' in obj) {
    return resolveAlias(obj.$value)
  }
  return value
}

export type TokenNode = {
  $type?: string
  $value?: string | number
  [key: string]: TokenNode | string | number | undefined
}

// Flatten a nested token object into an array of rows
export function flattenTokens(
  obj: TokenNode,
  prefix = ''
): Array<{ name: string; type: string; value: string; resolved: string }> {
  const rows: Array<{ name: string; type: string; value: string; resolved: string }> = []
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (val && typeof val === 'object' && '$value' in val) {
      const raw = String((val as TokenNode).$value ?? '')
      const type = String((val as TokenNode).$type ?? 'unknown')
      rows.push({
        name: fullKey,
        type,
        value: raw,
        resolved: resolveAlias(raw),
      })
    } else if (val && typeof val === 'object') {
      rows.push(...flattenTokens(val as TokenNode, fullKey))
    }
  }
  return rows
}

export type SemanticRow = {
  name: string
  type: string
  lightValue: string
  lightResolved: string
  darkValue: string
  darkResolved: string
}

// Flatten semantic tokens pairing light+dark
export function flattenSemantic(): SemanticRow[] {
  const rows: SemanticRow[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const light = (semanticTokens as any).light as TokenNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dark = (semanticTokens as any).dark as TokenNode

  function walk(lightObj: TokenNode, darkObj: TokenNode | undefined, prefix: string) {
    for (const [key, val] of Object.entries(lightObj)) {
      if (key.startsWith('$')) continue
      const fullKey = prefix ? `${prefix}.${key}` : key
      const lightNode = val as TokenNode
      const darkNode = darkObj ? (darkObj[key] as TokenNode) : undefined

      if (lightNode && typeof lightNode === 'object' && '$value' in lightNode) {
        const lRaw = String(lightNode.$value ?? '')
        const dRaw = darkNode && '$value' in darkNode ? String(darkNode.$value ?? '') : ''
        rows.push({
          name: fullKey,
          type: String(lightNode.$type ?? 'unknown'),
          lightValue: lRaw,
          lightResolved: resolveAlias(lRaw),
          darkValue: dRaw,
          darkResolved: resolveAlias(dRaw),
        })
      } else if (lightNode && typeof lightNode === 'object') {
        walk(lightNode, darkNode as TokenNode | undefined, fullKey)
      }
    }
  }

  walk(light, dark, '')
  return rows
}

// Get color scales from primitives
export function getColorScales() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colors = (primitiveTokens as any).color as Record<string, any>
  return Object.entries(colors)
    .filter(([, val]) => val && typeof val === 'object' && !('$value' in val))
    .map(([name, scale]) => ({
      name,
      swatches: Object.entries(scale as Record<string, TokenNode>)
        .filter(([k]) => !k.startsWith('$'))
        .map(([step, node]) => ({
          step,
          hex: String((node as TokenNode).$value ?? ''),
        })),
    }))
}

// Get flat non-color primitives by category
export function getNonColorPrimitives() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = primitiveTokens as any
  const skip = ['color']
  const categories: Record<string, Array<{ name: string; type: string; value: string }>> = {}

  for (const [cat, obj] of Object.entries(p)) {
    if (cat === '$schema' || skip.includes(cat)) continue
    if (obj && typeof obj === 'object') {
      const flat = flattenTokens(obj as TokenNode, '')
      categories[cat] = flat.map(r => ({ name: r.name, type: r.type, value: r.resolved || r.value }))
    }
  }
  return categories
}
