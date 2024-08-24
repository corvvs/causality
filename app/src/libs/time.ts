export function throttle(func: () => void, wait: number) {
  let lastCalledAt: number = 0;
  return () => {
    const calledAt = Date.now();
    const elapsed = calledAt - lastCalledAt;
    if (elapsed < wait) {
      return;
    }
    lastCalledAt = calledAt;
    func();
  }
}
