/** 별도 테스트 프레임워크 없이 실제 TypeScript 스토어와 Mock 집계를 검증한다. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  return originalResolve.call(
    this,
    request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request,
    parent,
    ...args,
  );
};
require.extensions['.ts'] = (module, filename) => {
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText;
  module._compile(source, filename);
};
const { useBudgetStore: store } = require('../src/store/useBudgetStore.ts');
const { createMockAIAnalysis } = require('../src/services/mock/ai.mock.ts');
const { calculateSavings, getAppliedPlanIds } = require('../src/utils/savings.ts');
const { mockAIBudget } = require('../src/services/mock/budget.mock.ts');
const { mockUserProfile } = require('../src/services/mock/profile.mock.ts');
const { fetchHomeSummary } = require('../src/services/mock/home.mock.ts');
const { useAuthStore } = require('../src/store/useAuthStore.ts');
const { useRecordStore } = require('../src/store/useRecordStore.ts');
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const report = createMockAIAnalysis(today);
const apply = (ids, analysis = report) => store.getState().applySavingsPlans(analysis, ids);
const snapshot = () =>
  JSON.stringify({
    budget: store.getState().confirmedBudget,
    applied: store.getState().appliedSavings,
  });
function seed(amounts = {}, selectedMonth = month) {
  store.getState().confirmBudget({
    year,
    month: selectedMonth,
    profile: mockUserProfile,
    recommendation: {
      ...mockAIBudget,
      categories: mockAIBudget.categories.map((item) => ({
        ...item,
        userAmount: amounts[item.category] ?? item.userAmount,
      })),
    },
  });
}
function unchanged(action) {
  const before = snapshot();
  assert.equal(action().success, false);
  assert.equal(snapshot(), before);
}
let passed = 0;
async function check(name, run) {
  store.getState().reset();
  await run();
  console.log('PASS ' + name);
  passed++;
}
(async () => {
  await check('empty / single / multi / all plan totals use monthly x12', () => {
    assert.deepEqual(calculateSavings([]), { monthly: 0, annual: 0 });
    assert.deepEqual(calculateSavings(report.plans.slice(0, 1)), {
      monthly: 80000,
      annual: 960000,
    });
    assert.deepEqual(calculateSavings(report.plans.slice(0, 2)), {
      monthly: 130000,
      annual: 1560000,
    });
    assert.deepEqual(calculateSavings(report.plans), { monthly: 150000, annual: 1800000 });
    assert.deepEqual(
      calculateSavings(
        Array.from({ length: 25 }, (_, i) => ({
          ...report.plans[0],
          id: String(i),
          monthlySavings: 1000,
        })),
      ),
      { monthly: 25000, annual: 300000 },
    );
  });
  await check('missing or different-month budget cannot be changed', () => {
    unchanged(() => apply(['cook-at-home']));
    seed({}, month === 12 ? 1 : month + 1);
    unchanged(() => apply(['cook-at-home']));
  });
  await check(
    'selected amounts update home total while original AI and records stay intact',
    async () => {
      seed();
      const before = await fetchHomeSummary(year, month);
      const previousMonth = await fetchHomeSummary(year, month === 12 ? 1 : month + 1);
      const records = JSON.stringify(useRecordStore.getState().records);
      assert.equal(apply(['cook-at-home', 'review-subscriptions']).success, true);
      const after = await fetchHomeSummary(year, month);
      assert.equal(before.budgetTotal - after.budgetTotal, 130000);
      assert.equal(after.remaining, Math.max(after.budgetTotal - after.totalExpense, 0));
      assert.equal(
        after.usageRate,
        Math.min(Math.round((after.totalExpense / after.budgetTotal) * 100), 100),
      );
      assert.equal(
        store.getState().confirmedBudget.recommendation.aiTotalAmount,
        mockAIBudget.aiTotalAmount,
      );
      assert.deepEqual(
        store.getState().confirmedBudget.recommendation.categories.map((i) => i.aiAmount),
        mockAIBudget.categories.map((i) => i.aiAmount),
      );
      assert.equal(JSON.stringify(useRecordStore.getState().records), records);
      assert.deepEqual(await fetchHomeSummary(year, month === 12 ? 1 : month + 1), previousMonth);
    },
  );
  await check('duplicate IDs and repeated clicks never deduct twice', () => {
    seed();
    assert.equal(apply(['cook-at-home', 'cook-at-home']).success, true);
    assert.equal(store.getState().appliedSavings.length, 1);
    unchanged(() => apply(['cook-at-home']));
    assert.equal(apply(['cook-at-home', 'review-phone-plan']).success, true);
    assert.equal(store.getState().appliedSavings.length, 2);
  });
  await check('same-category plans aggregate and a failed batch changes nothing', () => {
    seed({ dining: 90000 });
    const analysis = {
      ...report,
      plans: [...report.plans, { ...report.plans[0], id: 'second-dining', monthlySavings: 20000 }],
    };
    unchanged(() => apply(['cook-at-home', 'second-dining', 'review-phone-plan'], analysis));
    assert.equal(apply(['second-dining'], analysis).success, true);
    unchanged(() => apply(['cook-at-home', 'review-phone-plan'], analysis));
  });
  await check('budget can reach zero but cannot become negative', () => {
    seed({ dining: 80000 });
    assert.equal(apply(['cook-at-home']).success, true);
    assert.equal(
      store
        .getState()
        .confirmedBudget.recommendation.categories.find((i) => i.category === 'dining').userAmount,
      0,
    );
  });
  await check('empty selection, unknown plan and missing category do not mutate budget', () => {
    seed();
    unchanged(() => apply([]));
    unchanged(() => apply(['unknown-plan']));
    const budget = store.getState().confirmedBudget;
    store.getState().confirmBudget({
      ...budget,
      recommendation: {
        ...budget.recommendation,
        categories: budget.recommendation.categories.filter((i) => i.category !== 'dining'),
      },
    });
    unchanged(() => apply(['cook-at-home']));
  });
  await check('invalid, noninteger and unsafe monetary values are rejected', () => {
    seed();
    for (const amount of [-1, 0, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
      unchanged(() =>
        apply(['bad'], {
          ...report,
          plans: [{ ...report.plans[0], id: 'bad', monthlySavings: amount }],
        }),
      );
    }
  });
  await check('applied IDs are scoped to month, year and analysis', () => {
    seed();
    assert.equal(apply(report.plans.map((i) => i.id)).success, true);
    const history = store.getState().appliedSavings;
    assert.equal(getAppliedPlanIds(history, report.id, year, month).size, 3);
    assert.equal(getAppliedPlanIds(history, 'another-analysis', year, month).size, 0);
    assert.equal(getAppliedPlanIds(history, report.id, year + 1, month).size, 0);
    assert.equal(getAppliedPlanIds(history, report.id, year, month === 12 ? 1 : month + 1).size, 0);
  });
  await check('weekly report IDs are stable inside a week and handle year changes', () => {
    assert.equal(
      createMockAIAnalysis(new Date(2026, 11, 28)).id,
      createMockAIAnalysis(new Date(2027, 0, 3)).id,
    );
    assert.notEqual(
      createMockAIAnalysis(new Date(2027, 0, 3)).id,
      createMockAIAnalysis(new Date(2027, 0, 4)).id,
    );
  });
  await check('logout and a newly confirmed budget clear applied history', () => {
    seed();
    apply(['cook-at-home']);
    seed();
    assert.equal(store.getState().appliedSavings.length, 0);
    apply(['cook-at-home']);
    useAuthStore.getState().signOut();
    assert.equal(store.getState().confirmedBudget, null);
    assert.equal(store.getState().appliedSavings.length, 0);
  });
  console.log(`${passed} AI analysis scenarios passed.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
