import { ComponentWithProps } from "../types/components";
import { ColorValue } from "../types";
import { useColorPalette } from "../stores/color";

const textMap: { [key: string]: string } = {
  "transparent": "None",
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
        return <button
          key={i}
          className="color-picker-palette w-12 h-12 font-bold text-xs hover:shadow-md"
          style={{
            ...(color ? { backgroundColor: color } : {}),
            cursor: "pointer",
          }}
          onClick={() => {
            props.setColor(color);
          }}
        >{color ? (textMap[color] || "") : "Theme"}</button>
      })}
    </div>
  </div>
};
