// Rollup Configuration for Production Build
// config/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

// Main configuration
export default {
  input: 'src/main.js',
  output: {
    file: isProduction ? 'public/js/main.min.js' : 'public/js/main.js',
    format: 'iife',
    name: 'SutraKala',
    sourcemap: !isProduction,
    inlineDynamicImports: true
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.js', '.mjs']
    }),
    commonjs({
      transformMixedEsModules: true,
      include: /node_modules/
    }),
    ...(isProduction
      ? [
          terser({
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.debug', 'console.info']
            },
            mangle: {
              safari10: true,
              reserved: ['SutraKala']
            },
            format: {
              comments: false,
              ascii_only: true
            },
            sourceMap: true
          })
        ]
      : [])
  ],
  watch: {
    clearScreen: false,
    include: ['src/**'],
    exclude: ['node_modules/**', 'public/**', 'tests/**', 'docs/**']
  },
  onwarn: (warning, warn) => {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    if (warning.code === 'EVAL') return;
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  }
};
