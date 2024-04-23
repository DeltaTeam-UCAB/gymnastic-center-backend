module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    env: {
        node: true,
        browser: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        camelcase: [
            'error',
            {
                properties: 'always',
            },
        ],
        'no-return-await': ['error'],
        'no-var': ['error'],
        '@typescript-eslint/no-var-requires': 'off',
        'prefer-const': ['error'],
        'prefer-object-spread': ['error'],
        'prefer-regex-literals': ['error'],
        'sort-imports': ['warn'],
        semi: ['error', 'never'],
        'consistent-return': 2,
        indent: [1, 4],
        'no-else-return': 1,
        '@typescript-eslint/no-non-null-assertion': 'off',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
    },
}
