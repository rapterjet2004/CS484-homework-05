/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  const limit = Math.sqrt(n);
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

self.onmessage = (e: MessageEvent<number>) => {
  const limit = e.data;
  const start = typeof performance !== "undefined" ? performance.now() : Date.now();

  let count = 0;
  let lastPrime = -1;

  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) {
      count++;
      lastPrime = i;
    }
  }

  const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const duration = endTime - start;

  (self as any).postMessage({
    count,
    lastPrime,
    duration,
  });
};
