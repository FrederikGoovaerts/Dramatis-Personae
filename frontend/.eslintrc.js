module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier', 'import', 'react'],
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
        'plugin:react/recommended'
    ],
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/explicit-function-return-type': 0
    }
};
