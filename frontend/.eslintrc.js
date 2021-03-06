const CI_ENV = process.env.GITHUB_ACTION === undefined;
const WARN_AND_CI_ERROR = CI_ENV ? 1 : 2;

module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import', 'react', 'simple-import-sort'],
    parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true
        },
        project: './tsconfig.json'
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    extends: [
        'prettier',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': WARN_AND_CI_ERROR,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0
    }
};
