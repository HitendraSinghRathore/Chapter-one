import js from '@eslint/js';
import angularEslint from '@angular-eslint/eslint-plugin';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import angularEslintTemplateParser from '@angular-eslint/template-parser';
import globals from 'globals';

export default [
   js.configs.recommended,
  {
    files: ['src/**/*.ts'], 
    languageOptions: {
      parser: typescriptEslintParser, 
      globals: {
        browser: true,
        node: true,
        es2022: true
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint, 
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      
    },
  },
  {
    files: ['src/**/*.component.html'], 
    languageOptions: {
      parser: angularEslintTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularEslint, 
    }
  },
  {
    files: ['src/**/*.component.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
      globals: {
        ...globals.browser
      }
    },

    plugins: {
      '@angular-eslint': angularEslint,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...angularEslint.configs.recommended.rules,
    },
  },
  {
    files: ['src/**/*.spec.ts'], 
    languageOptions: {
      parser: typescriptEslintParser,
      globals: {
        'jasmine': true,
        'browser': true,
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules, 
      'no-unused-expressions': 'off',
      'no-undef': 'off'
    },
  },
];