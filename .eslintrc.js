module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: ['@typescript-eslint', 'react', 'react-native', 'react-hooks', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // Prettier 포맷 오류를 ESLint 에러로 표시
    'prettier/prettier': 'error',

    // React 17+ JSX transform — import React 불필요
    'react/react-in-jsx-scope': 'off',

    // props 타입은 TypeScript로 관리하므로 PropTypes 불필요
    'react/prop-types': 'off',

    // any 사용 금지
    '@typescript-eslint/no-explicit-any': 'error',

    // 미사용 변수 경고 (underscore prefix는 허용)
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    'react-hooks/refs': 'off',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', '.expo/'],
};
