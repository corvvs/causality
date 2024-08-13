import { registerStep } from "../../hooks/animation_queue";
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

  return <div className="border-2 border-green-500 bg-black/50">
    <input type="range" min={scaleMin} max={scaleMax} step="0.001" value={display.magnitude} onChange={(e) => {
      const center = getCenter();
      if (!center) { return; }
      changeScale(parseFloat(e.target.value), center);
      e.stopPropagation();
    }} />
    <p>{Math.floor(scale * 100 + 0.5)}%</p>
    <button onClick={(e) => {
      registerStep({
        stateFrom: display.magnitude,
        stateTo: 0,
        duration: 250,
        easing: easing.easeOutExpotential,
      }, (magNew) => {
        const center = getCenter();
        if (center) {
          changeScale(magNew, center);
        }
      });
      e.stopPropagation();
    }}>reset</button>
  </div>

};