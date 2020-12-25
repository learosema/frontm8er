import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import shebang from 'rollup-plugin-preserve-shebang';

export default [
  {
    input: 'src/cli.ts',
    output: {
      file: 'dist/cli.js',
      format: 'cjs',
    },
    plugins: [shebang(), json(), typescript()],
  },
  {
    input: 'src/frontm8er.ts',
    output: [
      {
        file: 'dist/frontm8er.js',
        format: 'cjs',
      },
      {
        file: 'dist/frontm8er.mjs',
        format: 'es',
      },
    ],
    plugins: [typescript()],
  },
];
