type ParameterAnimation = {
  stateFrom: number;
  stateTo: number;
  duration: number;
  easing: (t: number) => number;
};

export const registerStep = (animation: ParameterAnimation, updater: (val: number) => void) => {
  let startTime: DOMHighResTimeStamp | null = null;
  const step: FrameRequestCallback = (time) => {
    if (!startTime) { startTime = time; }
    const elapsed = time - startTime;
    const effectiveElapsed = Math.min(elapsed, animation.duration);

    const t = effectiveElapsed / animation.duration;
    const r = animation.easing(t);
    const magNew = animation.stateFrom * (1 - r) + animation.stateTo * r;
    updater(magNew);
    if (elapsed < animation.duration) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

