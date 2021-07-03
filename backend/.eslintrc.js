const CI_ENV = process.env.GITHUB_ACTION === undefined;
const WARN_AND_CI_ERROR = CI_ENV ? 1 : 2;

module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true,
        },
        project: './tsconfig.json',
    },
    extends: [
        'prettier',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': WARN_AND_CI_ERROR,
    },
};
