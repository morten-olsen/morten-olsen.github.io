import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import('eslint').ESLint.ConfigData}*/
export default [
  eslint.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      // "import/no-unresolved": "off",
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },
  eslintPluginPrettierRecommended,
  ...eslintPluginAstro.configs['flat/all'],
  {
    rules: {
      'astro/no-set-html-directive': 'off',
      'astro/no-unused-css-selector': 'off',
      'one-var': ['error', 'never'],
    },
  },
];
