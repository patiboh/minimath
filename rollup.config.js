import json from '@rollup/plugin-json';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  {
    input: 'src/main.js',
    output: {
      name: 'minimath',
      file: pkg.browser,
      format: 'umd',
      plugins: [ json(), terser() ]
    },
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/main.js',
    output: [
      { 
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
  }
]