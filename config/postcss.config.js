// PostCSS Configuration
// config/postcss.config.js
export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['>0.2%', 'not dead', 'not op_mini all', 'last 2 versions']
    },
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-properties': true,
        'nesting-rules': true,
        'focus-visible-pseudo-class': true,
        'not-pseudo-class': true,
        'color-functional-notation': false,
        'double-position-gradients': false
      }
    },
    cssnano:
      process.env.NODE_ENV === 'production'
        ? {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true
                },
                minifySelectors: true,
                mergeRules: true
              }
            ]
          }
        : false
  }
};
