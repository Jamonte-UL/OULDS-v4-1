# Next steps — getting to a running state

Steps are ordered by dependency. Complete each before moving to the next.

---

## Step 1 — Push to GitHub

Before any local work, get the scaffold into a shared repo so Pete can pull and test.

```bash
git init
git add .
git commit -m "chore: initial monorepo scaffold"
# create repo on GitHub, then:
git remote add origin https://github.com/<org>/oulds-design-system.git
git push -u origin main
```

Invite Pete as a collaborator. Pete should be able to clone and run steps 2–5 independently to verify the scaffold works on his machine.

---

## Step 2 — Install dependencies

From the repo root:

```bash
pnpm install
```

Requires: Node >=18, pnpm >=9. Install pnpm with `npm install -g pnpm` if needed.

---

## Step 3 — Build tokens

```bash
pnpm --filter @oulds/tokens build
```

This runs Style Dictionary against `packages/tokens/src/*.json` and outputs:
- `packages/tokens/dist/tokens.css` — CSS custom properties
- `packages/tokens/dist/tokens.js` + `tokens.d.ts` — JS/TS tokens

The placeholder token values are illustrative only. Replace them after running the Figma export (Step 6).

---

## Step 4 — Build components

```bash
pnpm --filter @oulds/components build
```

Stencil compiles components and — via its output targets — generates the React, Vue, and Angular wrapper files into their respective packages. The components package must build before the wrappers can be used.

---

## Step 5 — Run Storybook

```bash
pnpm --filter @oulds/storybook dev
```

Opens at `http://localhost:6006`. No stories exist yet — you'll see an empty Storybook. Add your first story alongside a pilot component (Step 7).

---

## Step 6 — Wire up the Figma token export

The export stub lives at `packages/tokens/scripts/export-figma.ts`.

What needs doing:
1. Obtain a Figma personal access token (Settings → Account → Personal access tokens)
2. Note the Figma file key from the URL of the Variables source file
3. Agree with the design team on variable collection naming: `Primitive`, `Semantic`, `Component`
4. Implement the transform logic in the script to map Figma variable collections → the three DTCG JSON files
5. Run:

```bash
FIGMA_TOKEN=<token> FIGMA_FILE_KEY=<key> npx tsx packages/tokens/scripts/export-figma.ts
```

After a successful export, review the diff in `packages/tokens/src/` and commit.

---

## Step 7 — Add a pilot component

Add a single component (e.g., `Button`) under `packages/components/src/components/button/` to flush out any issues with the Stencil config, wrapper generation, token consumption, and Storybook setup before scaling to more components.

See `docs/critical-work.md` for the pilot test plan.

---

## Step 8 — Full build

Once a component exists:

```bash
pnpm build
```

Turborepo runs all package builds in the correct order (tokens → components → wrappers → storybook) with caching.
