import typescript from '@rollup/plugin-typescript';
import shebang from 'rollup-plugin-preserve-shebang';

export default [
  {
    input: 'src/cli.ts',
    output: {
      file: 'dist/cli.js',
      format: 'cjs',
    },
    plugins: [shebang(), typescript()],
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
