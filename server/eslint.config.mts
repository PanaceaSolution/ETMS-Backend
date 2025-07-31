import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['**/*.{js,ts}'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  ...tseslint.configs.recommended, // ✅ this spreads correctly (not as a single object)
  pluginPrettierRecommended, // ✅ enables Prettier in ESLint v9 flat config
];
