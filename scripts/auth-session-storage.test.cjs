const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(
  path.join(__dirname, '../src/services/storage/authSessionStorage.web.ts'),
  'utf8',
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const key = 'planus.auth.session';
const savedSession = {
  state: {
    session: { userId: 1, accessToken: 'test-access', refreshToken: 'test-refresh' },
    hasCompletedOnboarding: true,
  },
  version: 0,
};

function createBrowser(data = new Map()) {
  return {
    localStorage: {
      getItem: (name) => data.get(name) ?? null,
      setItem: (name, value) => data.set(name, value),
      removeItem: (name) => data.delete(name),
    },
  };
}

function loadStorage(browser) {
  const context = { exports: {}, __DEV__: false };
  if (browser) context.window = browser;
  vm.runInNewContext(outputText, context);
  return context.exports.authSessionStorage;
}

test('같은 탭에서 새로고침 후 로그인 정보를 복원한다', () => {
  const browser = createBrowser();
  loadStorage(browser).setItem(key, savedSession);
  const restored = loadStorage(browser).getItem(key);
  assert.equal(JSON.stringify(restored), JSON.stringify(savedSession));
});

test('같은 사이트의 새 탭이나 재접속에서도 로그인 정보를 복원한다', () => {
  const data = new Map();
  loadStorage(createBrowser(data)).setItem(key, savedSession);
  const restored = loadStorage(createBrowser(data)).getItem(key);
  assert.equal(JSON.stringify(restored), JSON.stringify(savedSession));
});

test('다른 사이트나 브라우저 저장소에는 로그인 정보를 복원하지 않는다', () => {
  loadStorage(createBrowser()).setItem(key, savedSession);
  assert.equal(loadStorage(createBrowser()).getItem(key), null);
});

test('로그아웃하면 저장된 로그인 정보를 제거한다', () => {
  const browser = createBrowser();
  const storage = loadStorage(browser);
  storage.setItem(key, savedSession);
  storage.setItem(key, { state: { session: null, hasCompletedOnboarding: false }, version: 0 });
  assert.equal(storage.getItem(key), null);
  storage.setItem(key, savedSession);
  storage.removeItem(key);
  assert.equal(storage.getItem(key), null);
});

test('손상된 데이터는 제거하고 로그인하지 않은 상태로 시작한다', () => {
  const browser = createBrowser();
  browser.localStorage.setItem(key, '{broken');
  assert.equal(loadStorage(browser).getItem(key), null);
  assert.equal(browser.localStorage.getItem(key), null);
});

test('브라우저가 저장소 접근을 차단해도 예외를 전파하지 않는다', () => {
  const browser = Object.defineProperty({}, 'localStorage', {
    get() {
      throw new Error('Storage blocked');
    },
  });
  const storage = loadStorage(browser);
  assert.equal(storage.getItem(key), null);
  assert.doesNotThrow(() => storage.setItem(key, savedSession));
  assert.doesNotThrow(() => storage.removeItem(key));
});

test('window가 없는 빌드 환경에서도 안전하게 동작한다', () => {
  const storage = loadStorage();
  assert.equal(storage.getItem(key), null);
  assert.doesNotThrow(() => storage.setItem(key, savedSession));
  assert.doesNotThrow(() => storage.removeItem(key));
});
