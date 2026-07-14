export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const isConnErr =
      err instanceof Error && /closed|connection|timeout/i.test(err.message);
    if (retries > 0 && isConnErr) {
      await new Promise((r) => setTimeout(r, 500));
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
}
