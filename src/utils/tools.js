// 防止精度丢失，保留两位小数。
export function formatMoneyTwo(value) {
  return Math.round(+value * 100) / 100;
}
