// eslint-disable-next-line no-undef
module.exports = {
    ignorePatterns: ['jest.config.js'],
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    rules: {
        eqeqeq: [2, 'smart'],
        '@typescript-eslint/no-non-null-assertion': 'off', // necessary because Azure DevOps client libs are very nullish
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/camelcase': 'off', // apis are full of non camelcase
        '@typescript-eslint/no-unused-vars': 'off', // favour noUnusedLocals in tsconfig.json instead
    },
};
