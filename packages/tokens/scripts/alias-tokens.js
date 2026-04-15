/**
 * alias-tokens.js
 *
 * Transforms all three token tiers to use proper W3C DTCG alias references:
 *   1. primitive.json  — Normalizes complex color objects to plain hex strings
 *   2. semantic.json   — Replaces hardcoded color objects with {color.xxx.yyy} aliases
 *   3. component.json  — Replaces raw numbers with {spacing.x}, {radius.x}, etc. aliases
 *
 * Run from packages/tokens:
 *   node scripts/alias-tokens.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'src');

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(SRC, file), 'utf8'));
}

function save(file, data) {
  fs.writeFileSync(path.join(SRC, file), JSON.stringify(data, null, 2) + '\n');
  console.log(`  ✓ wrote ${file}`);
}

// ─── STEP 1: Build hex → primitive-token-path lookup ─────────────────────────

const primitive = load('primitive.json');
const hexToPrimitive = {};
const collisions = [];

function indexPrimitives(obj, pathParts) {
  if (!obj || typeof obj !== 'object') return;
  if ('$value' in obj) {
    const val = obj.$value;
    if (val && typeof val === 'object' && val.hex) {
      const hex = val.hex.toUpperCase();
      const fullPath = pathParts.join('.');
      if (!hexToPrimitive[hex]) {
        hexToPrimitive[hex] = fullPath;
      } else {
        collisions.push(`${hex}: first=${hexToPrimitive[hex]}, skipped=${fullPath}`);
      }
    }
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (!key.startsWith('$')) indexPrimitives(value, [...pathParts, key]);
  }
}

indexPrimitives(primitive, []);

// Resolve the black/transparent collision: always prefer color.black for #000000
hexToPrimitive['#000000'] = 'color.black';

if (collisions.length) {
  console.warn('\n⚠️  Hex collisions in primitive.json (first definition wins):');
  collisions.forEach(c => console.warn('   ' + c));
}

// ─── STEP 2: Normalize primitive.json ─────────────────────────────────────────
// Converts { colorSpace, components, alpha, hex } → plain hex string

function simplifyPrimitiveNode(obj, pathParts = []) {
  if (!obj || typeof obj !== 'object') return obj;
  if ('$value' in obj) {
    const val = obj.$value;
    if (val && typeof val === 'object' && 'hex' in val) {
      const fullPath = pathParts.join('.');
      // Fix broken transparent token (was stored as #000000 alpha:1, should be transparent)
      if (fullPath === 'color.transparent') {
        return { ...obj, $value: '#00000000' };
      }
      return { ...obj, $value: val.hex };
    }
    return obj;
  }
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = simplifyPrimitiveNode(value, [...pathParts, key]);
  }
  return result;
}

// ─── STEP 3: Transform semantic.json ──────────────────────────────────────────
// Colors     → {color.xxx.yyy} aliases
// Opacities  → {opacity.X} aliases
// Ring sizes → {borderWidth.X} aliases

const opacityMap    = { 0:'opacity.0', 5:'opacity.5', 10:'opacity.10', 20:'opacity.20', 30:'opacity.30', 40:'opacity.40', 50:'opacity.50', 60:'opacity.60', 70:'opacity.70', 80:'opacity.80', 90:'opacity.90', 100:'opacity.100' };
const borderWidthMap = { 0:'borderWidth.0', 1:'borderWidth.1', 2:'borderWidth.2', 4:'borderWidth.4' };

const unresolved = [];

function transformSemanticNode(obj, pathParts = []) {
  if (!obj || typeof obj !== 'object') return obj;

  if ('$value' in obj) {
    const val     = obj.$value;
    const pathStr = pathParts.join('.');

    // Color token — replace complex object with alias (or 8-digit hex for non-opaque)
    if (obj.$type === 'color' && val && typeof val === 'object' && 'hex' in val) {
      if (typeof val.alpha === 'number' && val.alpha !== 1) {
        // Non-opaque (e.g. overlay): encode alpha into 8-digit hex
        const a = Math.round(val.alpha * 255).toString(16).padStart(2, '0').toUpperCase();
        return { ...obj, $value: `${val.hex}${a}` };
      }
      const hex      = val.hex.toUpperCase();
      const primPath = hexToPrimitive[hex];
      if (primPath) {
        return { ...obj, $value: `{${primPath}}` };
      }
      // No match — keep as plain hex and log for review
      unresolved.push({ path: pathStr, hex });
      return { ...obj, $value: val.hex };
    }

    // Number token — alias opacity and ring-size tokens
    if (obj.$type === 'number' && typeof val === 'number') {
      if (pathStr.includes('opacity') && opacityMap[val] !== undefined) {
        return { ...obj, $value: `{${opacityMap[val]}}` };
      }
      if ((pathStr.includes('ring-width') || pathStr.includes('ring-offset')) && borderWidthMap[val] !== undefined) {
        return { ...obj, $value: `{${borderWidthMap[val]}}` };
      }
    }

    return obj;
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = transformSemanticNode(value, [...pathParts, key]);
  }
  return result;
}

// ─── STEP 4: Transform component.json ─────────────────────────────────────────
// Raw numbers → {spacing.x}, {radius.x}, {fontSize.x}, {borderWidth.x} aliases

const radiusMap   = { 0:'radius.none', 3:'radius.xs', 4:'radius.sm', 8:'radius.md', 12:'radius.lg', 16:'radius.xl', 24:'radius.2xl', 9999:'radius.full' };
const fontSizeMap = { 12:'fontSize.xs', 14:'fontSize.sm', 16:'fontSize.base', 18:'fontSize.lg', 20:'fontSize.xl', 24:'fontSize.2xl' };
const spacingMap  = { 0:'spacing.0', 4:'spacing.1', 8:'spacing.2', 12:'spacing.3', 16:'spacing.4', 20:'spacing.5', 24:'spacing.6', 32:'spacing.8', 40:'spacing.10', 48:'spacing.12', 64:'spacing.16', 80:'spacing.20', 96:'spacing.24' };

function transformComponentNode(obj, pathParts = []) {
  if (!obj || typeof obj !== 'object') return obj;

  if ('$value' in obj && obj.$type === 'number') {
    const val     = obj.$value;
    const pathStr = pathParts.join('.');
    const lastName = pathParts[pathParts.length - 1] ?? '';

    const isRadius    = lastName === 'radius'      || pathStr.includes('.radius.');
    const isFontSize  = lastName === 'font-size'   || pathStr.includes('.font-size.') || lastName === 'helper-text-size' || lastName === 'error-text-size';
    const isBorderW   = lastName === 'border-width' || pathStr.includes('.border-width');

    if (isRadius   && radiusMap[val]    !== undefined) return { ...obj, $value: `{${radiusMap[val]}}` };
    if (isFontSize  && fontSizeMap[val]  !== undefined) return { ...obj, $value: `{${fontSizeMap[val]}}` };
    if (isBorderW   && borderWidthMap[val] !== undefined) return { ...obj, $value: `{${borderWidthMap[val]}}` };
    if (spacingMap[val] !== undefined)                   return { ...obj, $value: `{${spacingMap[val]}}` };
    // No match (e.g. modal widths 400/560/720, max-widths) — keep raw
    return obj;
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = transformComponentNode(value, [...pathParts, key]);
  }
  return result;
}

// ─── RUN ──────────────────────────────────────────────────────────────────────

const newPrimitive = simplifyPrimitiveNode(primitive);

const semantic    = load('semantic.json');
const newSemantic = transformSemanticNode(semantic);

const component    = load('component.json');
const newComponent = transformComponentNode(component);

if (unresolved.length) {
  console.warn('\n⚠️  Semantic tokens with no primitive match (kept as plain hex):');
  unresolved.forEach(({ path, hex }) => console.warn(`   ${path}: ${hex}`));
}

console.log('\nWriting token files...');
save('primitive.json', newPrimitive);
save('semantic.json',  newSemantic);
save('component.json', newComponent);
console.log('\n✅ Done. Re-import all three files into Figma to see aliases.\n');
