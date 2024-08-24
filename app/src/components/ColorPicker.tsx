import { ComponentWithProps } from "../types/components";
import { ColorValue } from "../types";
import { useColorPalette } from "../stores/color";
import { Button } from "@headlessui/react";

const textMap: { [key: string]: string } = {
  "transparent": "None",
};

export const ColorButton: ComponentWithProps<{
  color: ColorValue | null;
  click?: (color: ColorValue | null) => void;
}> = (props) => {
  const {
    color,
    click,
  } = props;
  return <Button
    className={`color-picker-palette rounded-full w-12 h-12 font-bold text-xs ${click ? "hover:shadow-md" : ""}`}
    style={{
      ...(color ? { backgroundColor: color } : {}),
      cursor: "pointer",
    }}
    onClick={() => {
      if (click) {
        click(color);
      }
    }}
  >{color ? (textMap[color] || "") : "Theme"}</Button>
};

export const ColorPicker: ComponentWithProps<{
  currentColor: ColorValue | null;
  setColor: (color: ColorValue | null) => void;
}> = (props) => {

  const {
    colorPalette,
  } = useColorPalette();


  return <div
    className="edit-box color-picker p-4"
  >
    <div className="grid grid-cols-4 grid-flow-row gap-4">
      {colorPalette.colors.map((color, i) => {
        return <ColorButton
          key={i}
          color={color as ColorValue}
          click={props.setColor}
        >{color ? (textMap[color] || "") : "Theme"}</ColorButton>
      })}
    </div>
  </div>
};
