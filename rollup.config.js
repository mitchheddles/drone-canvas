import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const config = {
  input: 'src/index.js',
  output: [
    {
      file: 'lib/bundle.js',
      format: 'cjs',
    },
  ],
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env', { modules: false }]],
      plugins: ['@babel/plugin-proposal-class-properties'],
    }),
    resolve(),
    commonjs(),
  ],
};

export default config;
