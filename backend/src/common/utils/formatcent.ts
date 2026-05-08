export const fromCents = (balance: number) => balance / 100;
export const toCents = (balance: number) => Math.round(balance * 100);