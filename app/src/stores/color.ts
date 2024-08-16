import { atom, useAtom } from "jotai";
import { ColorValue } from "../types";

export type ColorPalette = {
  paletteMaxSize: number;
  colors: (ColorValue | null)[];
};

const deaultColorPalette: () => ColorPalette = () => ({
  paletteMaxSize: 16,
  colors: [
    null,
    "transparent",
    "black",
    "white",
    "red",
    "green",
    "blue",
  ],
});

const colorPaletteAtom = atom<ColorPalette>(deaultColorPalette());

export const useColorPalette = () => {
  const [colorPalette, setColorPalette] = useAtom(colorPaletteAtom);

  const setColorAtPalete = (index: number, color: ColorValue) => {
    if (index < 0 || index >= colorPalette.paletteMaxSize) {
      return;
    }
    setColorPalette((prev) => {
      const newColors = [...prev.colors];
      newColors[index] = color;
      return {
        paletteMaxSize: prev.paletteMaxSize,
        colors: newColors,
      };
    });
  };

  return {
    colorPalette,
    setColorAtPalete,
  }
};
