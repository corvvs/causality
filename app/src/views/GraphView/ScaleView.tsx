import { useAnimationQueue } from "../../hooks/animation_queue";
import { easing } from "../../libs/easing";
import { useDisplay } from "../../stores/display";
import { Vector } from "../../types";
import { ComponentWithProps } from "../../types/components";

export const ScaleView: ComponentWithProps<{ getCenter: () => Vector }> = ({
  getCenter
}) => {
  const {
    display,
    scale,
    changeScale,
    scaleMin,
    scaleMax,
  } = useDisplay();

  const {
    registerStep,
    stackedAnimations,
  } = useAnimationQueue();

  const animate = (from: number, to: number) => {
    if (stackedAnimations > 0) { return; }
    registerStep({
      stateFrom: from,
      stateTo: to,
      duration: 250,
      easing: easing.easeOutExpotential,
      updater: (magNew) => {
        const center = getCenter();
        if (center) {
          changeScale(magNew, center);
        }
      },
    });
  };

  return <div className="border-2 border-green-500 bg-black/50">
    <input type="range" min={scaleMin} max={scaleMax} step="0.001" value={display.magnitude} onChange={(e) => {
      const center = getCenter();
      if (!center) { return; }
      changeScale(parseFloat(e.target.value), center);
      e.stopPropagation();
    }} />
    <p>{Math.floor(scale * 100 + 0.5)}%</p>
    <button onClick={() => {
      animate(display.magnitude, display.magnitude - 0.25);
    }}>-</button>
    <button onClick={() => {
      animate(display.magnitude, 0);
    }}>reset</button>
    <button onClick={() => {
      animate(display.magnitude, display.magnitude + 0.25);
    }}>+</button>
  </div>

};