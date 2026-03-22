// Rollup Configuration for Production Build
// config/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

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
    // Suppress certain warnings
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    if (warning.code === 'EVAL') return;
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  }
};

// Additional entry points for code splitting (future use)
export const additionalConfigs = [
  {
    input: 'src/pages/cart/cart-page.js',
    output: {
      file: isProduction ? 'public/js/cart-page.min.js' : 'public/js/cart-page.js',
      format: 'iife',
      name: 'CartPage',
      sourcemap: !isProduction
    },
    plugins: [resolve({ browser: true }), commonjs(), ...(isProduction ? [terser()] : [])]
  },
  {
    input: 'src/pages/login/index.js',
    output: {
      file: isProduction ? 'public/js/login.min.js' : 'public/js/login.js',
      format: 'iife',
      name: 'LoginPage',
      sourcemap: !isProduction
    },
    plugins: [resolve({ browser: true }), commonjs(), ...(isProduction ? [terser()] : [])]
  }
];
