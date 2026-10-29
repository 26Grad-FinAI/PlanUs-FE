/** Windows/macOS 모두 동일한 개발 전용 플래그로 Expo를 시작한다. */
const { spawn } = require('node:child_process');
const path = require('node:path');
const cli = path.join(path.dirname(require.resolve('expo/package.json')), 'bin', 'cli');
const child = spawn(process.execPath, [cli, 'start', '--web', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, EXPO_PUBLIC_DESIGN_SYSTEM_PREVIEW: '1' },
});
child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
