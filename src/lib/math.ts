import Big from "big.js";

export function add(a: number, b: number): number {
  const result = new Big(a).plus(b).toNumber();
  return result;
}

export function subtract(a: number, b: number): number {
  const result = new Big(a).minus(b).toNumber();
  return result;
}

export function multiply(a: number, b: number): number {
  const result = new Big(a).times(b).toNumber();
  return result;
}

export function divide(a: number, b: number): number {
  const result = new Big(a).div(b).toNumber();
  return result;
}

export function toFixed(value: number, decimals: number = 2): string {
  const result = new Big(value).toFixed(decimals);
  return result;
}

export function sumProducts(
  items: { price: number; quantity: number }[]
): number {
  const total = items.reduce((sum, item) => {
    const itemTotal = new Big(item.price).times(item.quantity);
    const newSum = new Big(sum).plus(itemTotal).toNumber();
    return newSum;
  }, 0);
  return total;
}
