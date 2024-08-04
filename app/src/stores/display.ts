import { atom, useAtom } from "jotai";
import { CausalDisplay } from "../types";
import { localStorageProvider } from "../infra/localStorage";

const displayKey = "DISPLAY";
const displayProvider = localStorageProvider<CausalDisplay>();


const displayAtom = atom<CausalDisplay>(displayProvider.load(displayKey) ?? {
  origin: { x: 0, y: 0 },
  scale: 1,
});

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

  return {
    display,
    moveOrigin,
  };
};
