module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'max-len': ['error', { code: 120 }], // This is for setting max line length to 80 characters
    '@typescript-eslint/semi': ['error', 'always'] // Enforce semicolons
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    sourceType: 'module'
  }
};
