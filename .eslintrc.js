module.exports = {
  root: true,
  extends: ['expo', 'plugin:prettier/recommended'],
  rules: {
    // Prettier 포맷 오류를 ESLint 에러로 표시
    'prettier/prettier': 'error',

    // any 사용 금지
    '@typescript-eslint/no-explicit-any': 'error',

    // 미사용 변수 경고 (underscore prefix는 허용)
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['node_modules/', 'dist/', '.expo/'],
};
