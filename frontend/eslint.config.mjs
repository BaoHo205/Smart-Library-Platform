import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    files: ['*/.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/prop-types': 'off',
      'no-console': 'warn',
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.env',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local',
    ],
  },
  ...compat.extends('plugin:@next/next/recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
];