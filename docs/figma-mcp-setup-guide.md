# How to Connect GitHub Copilot to Figma via MCP

## What This Enables
You can use GitHub Copilot (in VS Code) to programmatically read and write to Figma files — creating components, binding design tokens, updating variants — all via the Plugin API.

---

## Step 1: Install the VS Code Extension

Install **"MCP Figma"** from the VS Code Extensions marketplace (it's the Talk to Figma one with the WebSocket panel).

---

## Step 2: Configure mcp.json

Open `c:\Users\<you>\AppData\Roaming\Code\User\mcp.json` and add both servers:

```json
{
  "servers": {
    "figmaDesktop": {
      "type": "http",
      "url": "http://127.0.0.1:3845/mcp"
    },
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    },
    "TalkToFigma": {
      "command": "npx",
      "args": ["@sethdouglasford/mcp-figma@latest"],
      "env": { "WEBSOCKET_PORT": "3055" }
    }
  },
  "inputs": []
}
```

- **`figmaDesktop`** — read-only, uses the Figma desktop app (port 3845)
- **`figma`** — the official Figma MCP, gives you `use_figma` (write access via Plugin API)
- **`TalkToFigma`** — alternative write path via WebSocket + Figma plugin

Do **Developer: Reload Window** after saving.

---

## Step 3: Connect Talk to Figma (WebSocket path)

This is the most reliable write path we found.

1. In VS Code, open the **MCP Figma** panel in the Explorer sidebar
2. Click **"Start WebSocket Server"** — it should show as Running on port 3055
3. Open your Figma file in **Figma desktop**
4. Run the **"Talk to Figma MCP Plugin"** from the Figma plugin menu
5. Note the **channel ID** shown (e.g. `kwsorzyh`)
6. In Copilot, tell it: *"Join Talk to Figma channel `<channel_id>`"*

Once joined, Copilot can read the document and create/edit nodes.

---

## Step 4: Connect Official Figma MCP (Plugin API path)

This is what unlocks `use_figma` — the full Plugin API with variable bindings.

The `https://mcp.figma.com/mcp` server uses **OAuth** — VS Code handles it automatically. After reloading, look for a **"Sign in to Figma"** notification or prompt in VS Code and complete it in the browser. Once authenticated, `use_figma` becomes available to Copilot.

> You can verify it's working by asking Copilot: *"Can you use use_figma to list the pages in my Figma file?"*

---

## Step 5: Install the Figma Skills

Clone the skills into your workspace under `.agents/skills/`:

```
.agents/
  skills/
    figma-use/              ← MANDATORY for any use_figma call
    figma-generate-design/
    figma-generate-library/
```

Download from: [github.com/figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) (or copy from this repo's `.agents/skills/` folder).

> **Critical:** Copilot must read `figma-use/SKILL.md` before every `use_figma` call. Always prompt it explicitly: *"Using the figma-use skill, ..."*

---

## Step 6: Write to Figma

With `use_figma` available, Copilot executes JavaScript against the **Figma Plugin API** in your file.

### Example: bind a variable to a node's fill
```js
const node = figma.getNodeById("39:4");
const variable = figma.variables.getLocalVariables().find(v => v.name === "button/primary/bg");
const base = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
const boundPaint = figma.variables.setBoundVariableForPaint(base, 'color', variable);
node.fills = [boundPaint];
return { mutatedNodeIds: [node.id] };
```

### Key rules Copilot follows (from the skill):
- Always `return` data — `console.log` is invisible
- `setBoundVariableForPaint` returns a **new** paint object — must reassign
- Load fonts before any text operation: `await figma.loadFontAsync(...)`
- Use `await figma.setCurrentPageAsync(page)` — the sync setter throws
- Work in small incremental steps, validate after each one

---

## Workflow Summary

| Goal | Tool to use |
|------|-------------|
| Read file structure, variables, components | `figmaDesktop` (read-only, always on) |
| Create nodes, bind variables, build components | `use_figma` via official `figma` MCP |
| Quick node creation/color changes | Talk to Figma WebSocket tools |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `use_figma` not available | Reload window, look for Figma OAuth sign-in prompt |
| Talk to Figma "not connected" | Start WebSocket server in MCP panel, then reconnect plugin in Figma |
| Font load error | Use `figma.listAvailableFontsAsync()` to find exact style string |
| Variable not found | Variable names are case-sensitive and path-separated with `/` (e.g. `button/primary/bg`) |
