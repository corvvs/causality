import { atom, useAtom } from "jotai";
import { CausalDisplay, Vector } from "../types";
import { localStorageProvider } from "../infra/localStorage";

const displayKey = "DISPLAY";
const displayProvider = localStorageProvider<CausalDisplay>();


const displayAtom = atom<CausalDisplay>(displayProvider.load(displayKey) ?? {
  origin: { x: 0, y: 0 },
  magnitude: 0,
});

const scaleMax = +1;
const scaleMin = -0.9;

export const useDisplay = () => {
  const [ display, setDisplay ] = useAtom(displayAtom);

  const moveOrigin = (x: number, y: number) => {
    setDisplay((prev) => {
      return {
        ...prev,
        origin: {
          x,
          y,
        },
      };
    });
  };

  const changeScale = (m: number, center: Vector) => {
    setDisplay((prev) => {
      const magNew = Math.max(scaleMin, Math.min(scaleMax, m));
      const scaleNew = Math.pow(10, magNew);
      const scaleOld = Math.pow(10, prev.magnitude);

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
  };

  return {
    display,
    moveOrigin,
    changeScale,
    scaleMin,
    scaleMax,
  };
};
