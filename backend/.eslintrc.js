module.exports = {
  parser: '@typescript-eslint/parser', // Tells ESLint to use the TypeScript parser
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses rules from the @typescript-eslint/eslint-plugin
    'prettier', // Disable ESLint rules that conflict with Prettier
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and sets Prettier rules as ESLint rules
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    // You can override/add custom rules here
    // 'no-console': 'warn', // Example: Warns about console.log statements
    // '@typescript-eslint/explicit-module-boundary-types': 'off', // Example: Disable explicit return types
  },
};