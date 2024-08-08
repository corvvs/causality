import { useEffect, useState } from "react";

export const useOnPinch = (props: {
  onPinchZoom?: (e: WheelEvent) => void,
  onPinchScroll?: (e: WheelEvent) => void,
}) => {
  const { onPinchZoom, onPinchScroll } = props;
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };
    const preventTouchDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        if (onPinchZoom) {
          onPinchZoom(e);
        }
      } else {
        if (onPinchScroll) {
          onPinchScroll(e);
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
  }, [onPinchScroll, onPinchZoom]);
};

export const useRerenderOnResize = (ref: React.MutableRefObject<Element | null>) => {
  const [, setSize] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((el) => {
        setSize(el.contentRect.width * el.contentRect.height);
      });
    });
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  });
};
