export function throttle<T extends any[]>(func: (...args: T) => void, wait: number) {
  let lastCalledAt: number = 0;
  return (...args: T) => {
    const calledAt = Date.now();
    const elapsed = calledAt - lastCalledAt;
    if (elapsed < wait) {
      return;
    }
    lastCalledAt = calledAt;
    func(...args);
  }
}
