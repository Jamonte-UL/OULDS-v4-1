/**
 * Figma Variables → DTCG token export script
 *
 * Usage:
 *   FIGMA_TOKEN=<personal-access-token> FIGMA_FILE_KEY=<file-key> npx tsx scripts/export-figma.ts
 *
 * Reads all variable collections from the Figma file and writes them to
 * src/primitive.json, src/semantic.json, and src/component.json in W3C DTCG format.
 *
 * Run manually whenever tokens are updated in Figma.
 */

const FIGMA_API = 'https://api.figma.com/v1';
const token = process.env.FIGMA_TOKEN;
const fileKey = process.env.FIGMA_FILE_KEY;

if (!token || !fileKey) {
  console.error('FIGMA_TOKEN and FIGMA_FILE_KEY must be set');
  process.exit(1);
}

async function fetchVariables() {
  const res = await fetch(`${FIGMA_API}/files/${fileKey}/variables/local`, {
    headers: { 'X-Figma-Token': token! },
  });

  if (!res.ok) {
    throw new Error(`Figma API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function main() {
  console.log('Fetching variables from Figma...');
  const data = await fetchVariables();

  // TODO: map data.meta.variables and data.meta.variableCollections
  // into Primitive / Semantic / Component DTCG JSON files and write to src/.
  //
  // Collection naming convention (agree with design team):
  //   "Primitive"  → src/primitive.json
  //   "Semantic"   → src/semantic.json
  //   "Component"  → src/component.json

  console.log('Collections found:', Object.keys(data.meta?.variableCollections ?? {}));
  console.log('TODO: implement transform and write to src/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
