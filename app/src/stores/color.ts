import { atom, useAtom } from "jotai";
import { ColorValue } from "../types";

export type ColorPalette = {
  paletteSize: number;
  colors: ColorValue[];
};

const deaultColorPalette: () => ColorPalette = () => ({
  paletteSize: 5,
  colors: [
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
    if (index < 0 || index >= colorPalette.paletteSize) {
      return;
    }
    setColorPalette((prev) => {
      const newColors = [...prev.colors];
      newColors[index] = color;
      return {
        paletteSize: prev.paletteSize,
        colors: newColors,
      };
    });
  };

  return {
    colorPalette,
    setColorAtPalete,
  }
};
