export type MouseEventLike = {
  clientX: number;
  clientY: number;
};

export function wrapForTouch(mouseEventHandler: (event: MouseEventLike) => void) {
  return (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseEventHandler(touch);
    }
  };
}

export function wrapForTouchGeneric<T>(mouseEventHandler: (event: MouseEventLike) => void) {
  return (e: React.TouchEvent<T>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseEventHandler(touch);
    }
  };
}
