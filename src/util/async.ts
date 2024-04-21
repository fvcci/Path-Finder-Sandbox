export const executeAsynchronously = async <T>(
  executionTimeMilliSecs: number,
  f: () => T
) =>
  new Promise<T>((resolve) => {
    const val = f();
    setTimeout(() => resolve(val), executionTimeMilliSecs);
  });
