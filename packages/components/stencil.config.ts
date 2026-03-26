import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

export const config: Config = {
  namespace: 'oulds',
  outputTargets: [
    {
      type: 'dist-custom-elements',
      externalRuntime: false,
      generateTypeDeclarations: true,
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    reactOutputTarget({
      outDir: '../react/src/components',
    }),
    vueOutputTarget({
      componentCorePackage: '@oulds/components',
      outDir: '../vue/src/components',
    }),
    angularOutputTarget({
      componentCorePackage: '@oulds/components',
      outputType: 'component',
      directivesProxyFile: '../angular/src/directives/proxies.ts',
      directivesArrayFile: '../angular/src/directives/index.ts',
    }),
  ],
  testing: {
    browserHeadless: 'new',
  },
};
