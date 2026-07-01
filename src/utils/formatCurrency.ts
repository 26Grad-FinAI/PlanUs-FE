/**
 * 금액 포맷 유틸
 */

// 천 단위 콤마 숫자 표기 (예: 214500 → "214,500")
export function formatComma(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

// 정확한 원 단위 금액 표기 (예: 214500 → "214,500원")
export function formatFullAmount(amount: number): string {
  return `${formatComma(amount)}원`;
}

// 만원 단위 축약 표기 — 차트 라벨 등 좁은 공간용 (예: 1800000 → "180만", 12000 → "1.2만")
export function formatManwon(amount: number): string {
  const manwon = amount / 10000;
  // 정수면 소수점 없이, 아니면 한 자리까지 표기
  const rounded = Number.isInteger(manwon) ? manwon : Math.round(manwon * 10) / 10;
  return `${rounded.toLocaleString('ko-KR')}만`;
}
