module.exports = {
  root: true,
  extends: ['prettier', 'plugin:react-native/all', '@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-native', 'prettier', 'react'],
  rules: {
    'react-native/no-inline-styles': 'off',
    'react-native/no-raw-text': 'off',
    'react-native/no-color-literals': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/sort-styles': 'off',

    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 'error',

    'no-shadow': 'error',
    '@typescript-eslint/no-shadow': ['error'],
    'react-hooks/exhaustive-deps': 'off',
    'no-undef': 'off',
    curly: 'off',
    'no-duplicate-imports': 'error',
  },
};
