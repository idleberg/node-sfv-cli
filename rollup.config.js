import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const defaults = {
  external: [
    'crypto'
  ],
  output: {
    file: 'bin/cli.mjs',
    format: 'esm'
  },
  plugins: [
    commonjs(),
    json(),
    typescript()
  ]
};

export default {
  ...defaults,
  input: 'src/cli.ts'
};
