import { ComponentWithProps } from "../types/components";
import { ColorValue } from "../types";
import { useColorPalette } from "../stores/color";

export const ColorPicker: ComponentWithProps<{
  currentColor: ColorValue | null;
  setColor: (color: ColorValue | null) => void;
}> = (props) => {

  const {
    colorPalette,
  } = useColorPalette();

  return <div
    className="edit-box p-4"
  >
    <div className="grid grid-cols-4 grid-flow-row gap-4">
      {colorPalette.colors.map((color, i) => {
        return <div
          key={i}
          className="w-8 h-8 rounded-full hover:shadow-md"
          style={{
            backgroundColor: color,
            cursor: "pointer",
          }}
          onClick={() => {
            props.setColor(color);
          }}
        ></div>
      })}
    </div>
  </div>
};
