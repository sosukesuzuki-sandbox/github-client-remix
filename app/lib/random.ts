const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function getRandomString(n: number) {
  return Array.from(globalThis.crypto.getRandomValues(new Uint32Array(n)))
    .map((v) => s[v % s.length])
    .join("");
}
