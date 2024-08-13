import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";

type ParameterAnimation = {
  stateFrom: number;
  stateTo: number;
  duration: number;
  updater: (val: number) => void;
  easing: (t: number) => number;
};

const animationStates = atom<{
  queue: ParameterAnimation[],
}>({
  queue: [],
});

export const useAnimationQueue = () => {
  const [animationState, setAnimationState] = useAtom(animationStates);
  const startTime = useRef<DOMHighResTimeStamp | null>(null);
  const ignite: FrameRequestCallback = useCallback((time) => {
    if (animationState.queue.length === 0) {
      window.requestAnimationFrame(ignite);
      return;
    }
    console.log("[ignite] animationState.queue.length", animationState.queue.length);
    const animation = animationState.queue[0];
    if (!startTime.current) { startTime.current = time; }
    const elapsed = time - startTime.current;
    const effectiveElapsed = Math.min(elapsed, animation.duration);

    const t = effectiveElapsed / animation.duration;
    const r = animation.easing(t);
    const magNew = animation.stateFrom * (1 - r) + animation.stateTo * r;
    animation.updater(magNew);
    if (elapsed < animation.duration) {
      window.requestAnimationFrame(ignite);
      return;
    }
    console.log("[ignite] end animation");
    setAnimationState((prev) => {
      return {
        queue: prev.queue.slice(1),
      };
    });
    startTime.current = null;
  }, [animationState.queue, setAnimationState]);

  const registerStep = (animation: ParameterAnimation) => {
    setAnimationState((prev) => {
      return {
        queue: [...prev.queue, animation],
      };
    });
  };

  useEffect(() => {
    const id = window.requestAnimationFrame(ignite);
    return () => {
      window.cancelAnimationFrame(id);
    };
  }, [ignite, animationState.queue]);

  return {
    registerStep,
  };
}

