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
