export function rateLimit<T extends (...args: any) => any>(
  fn: T,
  maxCallsPerPeriod: number,
  period: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let callsLeft = maxCallsPerPeriod;
  let windowStart = Date.now();
  let waitingPromise: Promise<void> | null = null;

  const reset = () => {
    callsLeft = maxCallsPerPeriod;
    windowStart = Date.now();
    waitingPromise = null;
  };

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const now = Date.now();

    // Check if we need to reset the window
    if (now - windowStart >= period) {
      reset();
    }

    // If we're out of calls, wait for the current window to expire
    if (callsLeft <= 0) {
      if (!waitingPromise) {
        const timeToWait = period - (now - windowStart);
        waitingPromise = new Promise<void>((resolve) =>
          setTimeout(() => {
            reset();
            resolve();
          }, timeToWait)
        );
      }
      await waitingPromise;
    }

    callsLeft--;
    console.log(
      `Function call allowed. ${callsLeft} calls remaining before limit.`
    );
    return fn(...args);
  };
}
