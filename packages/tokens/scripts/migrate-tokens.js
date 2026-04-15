const fs = require('fs');
const path = require('path');

// Read source token file
const sourceFile = path.join(__dirname, '../src/Value.tokens.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));

// Helper: Remove $extensions metadata
function cleanToken(token) {
  if (typeof token !== 'object' || token === null) return token;
  
  const cleaned = {};
  for (const [key, value] of Object.entries(token)) {
    if (key === '$extensions') continue;
    
    // Recursively clean nested objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Special handling for color values
      if (value.hex && value.colorSpace) {
        // Simplify color object to just hex string for cleaner output
        cleaned[key] = value.hex;
      } else if (value.$value !== undefined || value.$type !== undefined) {
        // This is a token object, clean it but preserve structure
        cleaned[key] = cleanToken(value);
      } else {
        // Nested token group
        cleaned[key] = cleanToken(value);
      }
    } else {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

// Fix malformed font-family strings
function fixFontFamily(value) {
  if (typeof value !== 'string') return value;
  
  // Fix: "Open Sans', " -> "'Open Sans', "
  value = value.replace(/^Open Sans'/, "'Open Sans'");
  // Fix: "Roboto Mono', " -> "'Roboto Mono', "
  value = value.replace(/^Roboto Mono'/, "'Roboto Mono'");
  
  return value;
}

// Convert tier-prefixed aliases to root-level aliases
function convertAliases(token, isValue = false) {
  if (typeof token === 'string' && token.startsWith('{primitives.')) {
    // Convert {primitives.color.gray.700} -> {color.gray.700}
    return token.replace(/\{primitives\./, '{');
  }
  
  if (typeof token !== 'object' || token === null) return token;
  
  const converted = {};
  for (const [key, value] of Object.entries(token)) {
    if (key === '$value' && typeof value === 'string') {
      // Fix font-family values and convert aliases
      const fixed = fixFontFamily(value);
      converted[key] = convertAliases(fixed, true);
    } else if (typeof value === 'object') {
      converted[key] = convertAliases(value);
    } else if (typeof value === 'string' && isValue) {
      converted[key] = fixFontFamily(value);
    } else {
      converted[key] = value;
    }
  }
  
  return converted;
}

// Simplify color values from object form to hex strings
function simplifyColorValues(token) {
  if (typeof token !== 'object' || token === null) return token;
  
  const simplified = {};
  for (const [key, value] of Object.entries(token)) {
    if (key === '$value' && typeof value === 'object' && value.hex) {
      // Convert color object to hex string
      simplified[key] = value.hex;
    } else if (typeof value === 'object' && value !== null) {
      simplified[key] = simplifyColorValues(value);
    } else {
      simplified[key] = value;
    }
  }
  
  return simplified;
}

console.log('Starting token migration...\n');

// === PRIMITIVE.JSON ===
console.log('Processing primitive.json...');
const primitiveRaw = source.primitives;
const primitive = simplifyColorValues(cleanToken(primitiveRaw));

// Fix font-family values in primitive
if (primitive.fontFamily) {
  for (const key of Object.keys(primitive.fontFamily)) {
    if (primitive.fontFamily[key].$value) {
      primitive.fontFamily[key].$value = fixFontFamily(primitive.fontFamily[key].$value);
    }
  }
}

const primitiveOutput = {
  "$schema": "https://design-tokens.github.io/community-group/format/",
  ...primitive
};

fs.writeFileSync(
  path.join(__dirname, '../src/primitive.json'),
  JSON.stringify(primitiveOutput, null, 2),
  'utf-8'
);
console.log('✓ primitive.json written\n');

// === SEMANTIC.JSON ===
console.log('Processing semantic.json...');
const semanticRaw = source.semantic;
const semanticCleaned = cleanToken(semanticRaw);
const semantic = convertAliases(simplifyColorValues(semanticCleaned));

const semanticOutput = {
  "$schema": "https://design-tokens.github.io/community-group/format/",
  ...semantic
};

fs.writeFileSync(
  path.join(__dirname, '../src/semantic.json'),
  JSON.stringify(semanticOutput, null, 2),
  'utf-8'
);
console.log('✓ semantic.json written\n');

// === COMPONENT.JSON ===
console.log('Processing component.json...');
const componentRaw = source.component;
const componentCleaned = cleanToken(componentRaw);
const component = convertAliases(componentCleaned);

const componentOutput = {
  "$schema": "https://design-tokens.github.io/community-group/format/",
  ...component
};

fs.writeFileSync(
  path.join(__dirname, '../src/component.json'),
  JSON.stringify(componentOutput, null, 2),
  'utf-8'
);
console.log('✓ component.json written\n');

console.log('Migration complete! ✅');
console.log('\nSummary:');
console.log(`- primitive.json: ${Object.keys(primitive).length} top-level groups`);
console.log(`- semantic.json: ${Object.keys(semantic).length} mode(s)`);
console.log(`- component.json: ${Object.keys(component).length} components`);
