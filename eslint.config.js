import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
import importPlugin from 'eslint-plugin-import';
import htmlPlugin from 'eslint-plugin-html';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.jest,
            },
        },
        plugins: {
            html: htmlPlugin,
            prettier: prettierPlugin,
            jest: jestPlugin,
            import: importPlugin,
        },
        rules: {
            // legacy: "extends": ["plugin:prettier/recommended"]
            ...prettierConfig.rules,
            'prettier/prettier': 'error',

            // legacy: "extends": ["plugin:import/errors", "plugin:import/warnings"]
            ...importPlugin.flatConfigs.errors.rules,
            ...importPlugin.flatConfigs.warnings.rules,

            // jest rules (from .eslintrc.json)
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/prefer-to-have-length': 'warn',
            'jest/valid-expect': 'error',

            // import rules
            'import/no-cycle': ['error', { maxDepth: 1 }],

            // general rules
            'no-var': 'error',
            eqeqeq: 'warn',
            'no-unused-vars': 'warn',
        },
    },
];
