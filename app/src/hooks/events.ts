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
    document.addEventListener('gesturestart', preventDefault);
    return () => {
      document.removeEventListener('gesturestart', preventDefault);
    };
  }, []);

  useEffect(() => {
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
    document.addEventListener('wheel', onWheel, { passive: false });
    return () => {
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
  }, [ref, setSize]);

  useEffect(() => {
    // orientationchange
    const onOrientationChange = (e: Event) => {
      const w = e.currentTarget as Window;
      setSize(w.innerWidth + w.innerHeight);
    };
    window.addEventListener('orientationchange', onOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  });
};
