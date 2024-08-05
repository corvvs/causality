import { useEffect } from "react";

export const useOnPinch = (props: {
  onPinch?: (e: WheelEvent) => void,
}) => {
  const { onPinch } = props;
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    const preventTouchDefault = (e: TouchEvent) => {
      console.log("TOUCH")
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        if (onPinch) {
          onPinch(e);
        }
      }
    };

    document.addEventListener('touchstart', preventTouchDefault, { passive: false });
    document.addEventListener('touchmove', preventTouchDefault, { passive: false });
    document.addEventListener('gesturestart', preventDefault);
    document.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventTouchDefault);
      document.removeEventListener('touchmove', preventTouchDefault);
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('wheel', onWheel);
    };
  }, [onPinch]);
};