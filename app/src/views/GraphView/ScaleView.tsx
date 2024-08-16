import { Button } from "@headlessui/react";
import { useAnimationQueue } from "../../hooks/animation_queue";
import { easing } from "../../libs/easing";
import { useDisplay } from "../../stores/display";
import { Vector } from "../../types";
import { ComponentWithProps } from "../../types/components";
import { VscZoomIn, VscZoomOut } from 'react-icons/vsc';
import { InlineIcon } from "../../components/InlineIcon";

export const ScaleView: ComponentWithProps<{ getCenter: () => Vector }> = ({
  getCenter
}) => {
  const {
    display,
    scale,
    changeScale,
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

  return <div className="system-box border-2 bg-black/50 grid grid-flow-col grid-rows-1 items-center">
    <p className="w-20">
      {Math.floor(scale * 100 + 0.5)}%
    </p>
    <Button className="ce-button rounded text-lg" onClick={() => {
      animate(display.magnitude, display.magnitude - 0.25);
    }}>
      <InlineIcon i={<VscZoomOut />} />
    </Button>
    <Button className="ce-button rounded text-lg" onClick={() => {
      animate(display.magnitude, 0);
    }}>reset</Button>
    <Button className="ce-button rounded text-lg" onClick={() => {
      animate(display.magnitude, display.magnitude + 0.25);
    }}>
      <InlineIcon i={<VscZoomIn />} />
    </Button>
  </div>

};