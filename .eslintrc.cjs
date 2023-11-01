module.exports = {
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-tsdoc'],
  extends: ['plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['webpack.config.mjs', '.eslintrc.cjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'tsdoc/syntax': 'warn',
    'no-multi-spaces': ['error'],
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1, maxEOF: 0 }]
  }
};
