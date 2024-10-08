import { atom, useAtom } from "jotai";
import { CausalDisplay, CausalDisplayVersioned, Vector } from "../types";
import { localStorageProvider } from "../infra/localStorage";
import { affineCompose, affineInvert, affineScale, affineTranslation } from "../libs/affine";
import { useCallback, useMemo } from "react";

const displayKey = "DISPLAY";
const displayProvider = localStorageProvider<CausalDisplayVersioned>(displayKey);

const currentDisplayVersion = "0.0.2";
function loadDisplay() {
  const d = displayProvider.load();
  if (d && d.version === currentDisplayVersion) {
    return d;
  }
  return null;
}
const displayAtom = atom<CausalDisplayVersioned>(loadDisplay() ?? {
  version: currentDisplayVersion,
  origin: { x: 0, y: 0 },
  magnitude: 0,
});

const scaleMax = +2;
const scaleMin = -2;

function magnitudeToScale(m: number) {
  return Math.pow(10, m);
}

export const useDisplay = () => {
  const [ display, setDisplay ] = useAtom(displayAtom);

  const moveOrigin = useCallback((x: number, y: number) => {
    setDisplay((prev) => {
      return {
        ...prev,
        origin: {
          x,
          y,
        },
      };
    });
  }, [setDisplay]);

  const changeScale = useCallback((m: number, center: Vector) => {
    setDisplay((prev) => {
      const magNew = Math.max(scaleMin, Math.min(scaleMax, m));
      const scaleNew = magnitudeToScale(magNew);
      const scaleOld = magnitudeToScale(prev.magnitude);

      const origin: Vector = {
        x: (prev.origin.x - center.x) * (scaleNew/scaleOld) + center.x,
        y: (prev.origin.y - center.y) * (scaleNew/scaleOld) + center.y,
      }
      return {
        ...prev,
        magnitude: magNew,
        origin,
      };
    });
  }, [setDisplay]);

  const scale = magnitudeToScale(display.magnitude);
  const affineFieldToData = useMemo(() => affineScale({ x: scale, y: scale }), [scale]);
  const affineDataToTag = useMemo(() => affineTranslation(display.origin), [display.origin]);
  const affineFieldToTag = useMemo(() => affineCompose(affineDataToTag, affineFieldToData), [affineDataToTag, affineFieldToData]);
  const affineTagToField = useMemo(() => affineInvert(affineFieldToTag), [affineFieldToTag]);

  const saveDisplay = () => {
    displayProvider.save(display);
    console.log("[display] saved.")
  };

  return {
    display: display as CausalDisplay,
    scale,
    transformFieldToBrowser: `translate(${display.origin.x}px, ${display.origin.y}px) scale(${scale})`,
    affineFieldToTag,
    affineTagToField,
    moveOrigin,
    changeScale,
    scaleMin,
    scaleMax,
    saveDisplay,
  };
};
