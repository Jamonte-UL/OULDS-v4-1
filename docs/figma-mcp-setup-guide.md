# How to Connect GitHub Copilot to Figma via MCP

## What This Enables

You can use GitHub Copilot (in VS Code) to programmatically **read and write** to Figma files — creating components, binding design tokens, updating variants — all via the Figma Plugin API.

## Recommended Setup: Official Figma MCP + `use_figma` Skill

The **Official Figma MCP** with the **figma-use skill** is the primary and most reliable method. It gives you full Plugin API access — read file structure, create nodes, bind variables, build components — all through a single OAuth connection. No plugins, WebSockets, or channel IDs needed.

The other methods (Talk to Figma, Figma Desktop MCP) are optional alternatives documented at the end of this guide.

---

## Part 1: Figma Account Setup

### 1A. Create a Personal Access Token

You need a Figma Personal Access Token for API-level access (used by Style Dictionary exports and REST API scripts).

1. Open **Figma** in the browser → click your **profile icon** (top-right) → **Settings**
2. Go to the **Security** tab
3. Scroll to **Personal access tokens**
4. Click **Generate new token**
5. Give it a name (e.g. `v4dsupdates`) and set an expiration
6. Copy the token immediately — you won't see it again

> Store this token securely. You won't need it for the MCP connection itself (that uses OAuth), but you will need it for scripts that call the Figma REST API directly.

### 1B. Review Connected Apps

On the same **Security** tab, scroll to **Connected apps**. These are OAuth connections from tools like VS Code. Each time you authorize "Figma MCP in VS Code" it appears here. You can **Revoke access** for any you don't recognize or if you need to re-authenticate.

---

## Part 2: VS Code Setup

### 2A. Configure mcp.json

Open your VS Code MCP config:

**Windows:** `%APPDATA%\Code\User\mcp.json`
**Mac:** `~/Library/Application Support/Code/User/mcp.json`

Add the official Figma MCP server:

```json
{
  "servers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    }
  },
  "inputs": []
}
```

After saving, run **Developer: Reload Window** (`Ctrl+Shift+P` → type "Reload Window").

### 2B. Authorize Figma (one-time OAuth)

After reloading:

1. Look for a **"Sign in to Figma"** notification in VS Code
2. Click it — your browser opens Figma's OAuth consent page
3. Authorize **"Figma MCP in VS Code"**
4. Back in VS Code, `use_figma` is now available

> If you don't see the notification, open the Command Palette (`Ctrl+Shift+P`) and run **MCP: List Servers** to check the connection status.

### 2C. Install the Figma Agent Skills

Copy the skills into your workspace under `.agents/skills/`:

```
.agents/
  skills/
    figma-use/              ← MANDATORY before any use_figma call
    figma-generate-design/  ← For building full screens in Figma
    figma-generate-library/ ← For building token/component libraries
```

These come from [github.com/figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) (or copy from this repo's `.agents/skills/` folder).

> **Critical:** Always tell Copilot *"Using the figma-use skill, ..."* so it reads the skill before calling `use_figma`. Skipping this causes hard-to-debug failures.

---

## Part 3: Connecting to a Figma Design File

With OAuth complete, you just need to give Copilot your **file URL** or **file key**.

### Getting your file key

Your Figma URL looks like this:
```
https://www.figma.com/design/wqh88OOJ3JRPrkLAjeWHhS/OULDS-Tokens?node-id=0-1
                              ^^^^^^^^^^^^^^^^^^^^^^^^
                              this is the file key
```

The file key is the random string between `/design/` and the file name.

### Verify the connection

Paste your file URL or key to Copilot and ask it to connect:

> *"Using the figma-use skill, list all pages in my Figma file: https://www.figma.com/design/wqh88OOJ3JRPrkLAjeWHhS/OULDS-Tokens"*

Copilot should return the file's pages, confirming the connection works.

### What you can read immediately

Once connected, Copilot can read everything in the file via `use_figma`:
- **Pages** — list all pages and their contents
- **Variable collections** — list all collections, modes, and individual variables with values
- **Components** — inspect component structure, variants, and properties
- **Node tree** — traverse the entire layer hierarchy
- **Styles** — text styles, effect styles, grid styles

No need for a separate "read-only" connection — `use_figma` handles both reading and writing.

---

## Part 4: Working in a Design File

### Reading a design (design-to-code)

Give Copilot a Figma URL with a specific node selected:

```
https://www.figma.com/design/ABC123/MyFile?node-id=39-4
```

Copilot will use `get_design_context` to pull the design, screenshot, and code hints. It then adapts the output to your project's stack and existing components.

### How to get node IDs

- **Right-click** any layer in Figma → **Copy/Paste as** → **Copy link** — the `node-id` is in the URL
- In the URL, dashes (`39-4`) get converted to colons (`39:4`) for the Plugin API

### Writing to a design

Tell Copilot what you want to create or modify:

> *"Using the figma-use skill, create a Button component in my file `<fileKey>` with Primary and Secondary variants, using my existing color variables"*

Copilot executes JavaScript against the Figma Plugin API:

```js
// Example: bind a variable to a node's fill
const node = figma.getNodeById("39:4");
const variable = figma.variables.getLocalVariables().find(v => v.name === "button/primary/bg");
const base = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
const boundPaint = figma.variables.setBoundVariableForPaint(base, 'color', variable);
node.fills = [boundPaint];
return { mutatedNodeIds: [node.id] };
```

### Key rules for Plugin API calls

- Always `return` data — `console.log` is invisible in `use_figma`
- `setBoundVariableForPaint` returns a **new** paint object — must reassign to `node.fills`
- Load fonts before any text operation: `await figma.loadFontAsync(...)`
- Use `await figma.setCurrentPageAsync(page)` — the sync setter throws
- Work in small incremental steps, validate after each one

---

## Part 5: Common Workflows

### Workflow A: Read a design and generate code

1. Copy the Figma link to the frame/component you want
2. Paste it to Copilot: *"Generate a React component from this design: `<URL>`"*
3. Copilot reads the design via `get_design_context` and produces code adapted to your project

### Workflow B: Inspect variables and components

1. Give Copilot your file key
2. Ask: *"Using the figma-use skill, list all variable collections and their variables in `<fileKey>`"*
3. Copilot runs `use_figma` to enumerate collections, modes, and values — no separate tool needed

### Workflow C: Push tokens/components from code into Figma

1. Give Copilot your file key
2. Tell Copilot: *"Using the figma-use skill, create variables in `<fileKey>` from my token JSON files"*
3. Copilot reads your `packages/tokens/src/*.json` and creates matching Figma variables

### Workflow D: Build or update a full screen in Figma

1. Give Copilot your file key and describe the screen
2. Tell Copilot: *"Using the figma-use skill, build a login screen in `<fileKey>` using my existing design system components and variables"*
3. Copilot uses `search_design_system` to find existing components, imports them, and assembles the layout

---

## Part 6: Alternative Connection Methods

These are optional. Use them only if you have a specific need not covered by the Official Figma MCP.

### Talk to Figma (WebSocket path)

A WebSocket bridge that connects via a Figma desktop plugin. Useful for quick, interactive edits where you want a live bidirectional connection.

**Setup:**

1. Install **"MCP Figma"** (Talk to Figma) from the VS Code Extensions marketplace
2. Add to your `mcp.json`:
   ```json
   "TalkToFigma": {
     "command": "npx",
     "args": ["@sethdouglasford/mcp-figma@latest"],
     "env": { "WEBSOCKET_PORT": "3055" }
   }
   ```
3. Reload VS Code

**Connecting:**

1. **In VS Code:** Open the **MCP Figma** panel in the Explorer sidebar → click **"Start WebSocket Server"**
2. **In Figma desktop:** Open your file → run **Plugins → Talk to Figma MCP Plugin**
3. In the plugin panel, set **WebSocket Server Port** to `3055` → click **Connect**
4. Note the **channel ID** shown (e.g. `kwsorzyh`)
5. **In Copilot:** *"Join Talk to Figma channel `kwsorzyh`"*

> **If it says "Disconnected from server":** The WebSocket server must be running in VS Code (step 1) before clicking Connect in the Figma plugin (step 3).

### Figma Desktop MCP (read-only)

Connects automatically when Figma desktop is running. Provides read-only access to the open file.

**Setup:** Add to your `mcp.json`:
```json
"figmaDesktop": {
  "type": "http",
  "url": "http://127.0.0.1:3845/mcp"
}
```

No auth required — just have Figma desktop open with your file.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `use_figma` not available | Reload VS Code window, look for Figma OAuth sign-in prompt |
| OAuth keeps re-prompting | Check Figma **Settings → Security → Connected apps** — revoke old "Figma MCP in VS Code" entries and re-authorize |
| Font load error | Use `figma.listAvailableFontsAsync()` to find the exact font family + style string |
| Variable not found | Variable names are case-sensitive and path-separated with `/` (e.g. `button/primary/bg`) |
| Node ID format mismatch | URLs use dashes (`39-4`), Plugin API uses colons (`39:4`) — convert accordingly |
| Personal access token expired | Go to **Figma Settings → Security → Personal access tokens** → generate a new one |
| Talk to Figma "Disconnected" | Start WebSocket server in VS Code first, then Connect in Figma plugin |
| Talk to Figma wrong port | Both the plugin port field and `mcp.json` `WEBSOCKET_PORT` must say `3055` |
