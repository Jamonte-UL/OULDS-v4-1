import StyleDictionary from 'style-dictionary';

// Register custom transform to extract hex value from color objects for CSS
StyleDictionary.registerTransform({
  name: 'color/css/hex',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'color',
  transform: (token) => {
    // If the value is already a string (hex), return it
    if (typeof token.$value === 'string') {
      return token.$value;
    }
    // If it's an object with hex property, return the hex (with alpha if < 1)
    if (token.$value?.hex) {
      const hex = token.$value.hex;
      const alpha = token.$value.alpha;
      if (typeof alpha === 'number' && alpha < 1) {
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase();
        return hex + alphaHex;
      }
      return hex;
    }
    // Otherwise return the value as-is
    return token.$value;
  },
});

export default {
  source: ['src/**/*.json'],
  preprocessors: ['dtcg'],
  platforms: {
    css: {
      transforms: ['attribute/cti', 'name/kebab', 'time/seconds', 'html/icon', 'size/rem', 'color/css/hex'],
      prefix: 'oulds',
      buildPath: 'dist/',
      options: {
        outputReferences: true,
      },
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js', 
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
  },
};
