export function rateLimit<T extends (...args: any) => any>(
  fn: T,
  maxCallsPerPeriod: number,
  period: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let callsLeft = maxCallsPerPeriod;
  let timeout: NodeJS.Timeout | Timer | null = null;

  const refill = () => {
    callsLeft = maxCallsPerPeriod;
  };

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (callsLeft <= 0) {
      if (!timeout) {
        console.log(
          `Rate limit exceeded, next allowable call in ${
            period - (Date.now() % period)
          } ms`
        );
        await new Promise<void>((resolve) => {
          timeout = setTimeout(() => {
            refill();
            resolve();
            timeout = null;
          }, period - (Date.now() % period)); // this ensures we wait until the end of the period
        });
      } else {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, period - (Date.now() % period))
        );
      }
    }

    callsLeft--; // Decrement the count of available calls
    console.log(
      `Function call allowed. ${callsLeft} calls remaining before limit.`
    );
    return fn(...args);
  };
}
