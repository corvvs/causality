import { Button, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { InlineIcon } from "../InlineIcon"
import { SlMagnifier } from "react-icons/sl"
import { ColorTheme, useColorTheme } from "../../stores/theme"
import { MdOutlineDarkMode, MdOutlineLightbulb, MdOutlineLightMode } from "react-icons/md"
import { ScaleView } from "../../views/GraphView/ScaleView"
import { Vector } from "../../types"
import { ComponentWithProps } from "../../types/components"
import { ThemeSelector } from "../ThemeSelector"
import { MultipleButtons } from "../MultipleButtons"
import { TbCircle, TbSquare, TbSquares } from "react-icons/tb"
import { useDisplay } from "../../stores/display"
import { affineApply } from "../../libs/affine"
import { useGraph } from "../../stores/graph"

const getIconTypeForColorTheme = (colorTheme: ColorTheme) => {
  switch (colorTheme) {
    case "light":
      return MdOutlineLightMode;
    case "dark":
      return MdOutlineDarkMode;
    case "system":
      return MdOutlineLightbulb;
  }
};

export const BasicPalette: ComponentWithProps<{
  getCenter: () => Vector;
}> = (props) => {

  const {
    appColorTheme,
  } = useColorTheme();

  const {
    affineTagToField,
  } = useDisplay();

  const {
    addRectNode,
    addCircleNode,
  } = useGraph();

  const IconTypeForColorTheme = getIconTypeForColorTheme(appColorTheme);

  return <div className="basic-palette">
    <div className="grid grid-cols-1 grid-flow-row gap-2 p-1 pb-2">
      <div>
        <Popover className="relative">
          <PopoverButton as="div">
            <Button className="basic-palette-button p-1">
              <InlineIcon i={<TbSquares className="w-6 h-6" />} />
            </Button>
          </PopoverButton>
          <PopoverPanel anchor="right" transition className="flex flex-col transition duration-200 ease-out data-[closed]:-translate-x-1 data-[closed]:opacity-0">
            <MultipleButtons
              items={[
                {
                  key: "Rectangle",
                  content: <div
                    className="h-[1.5rem]"
                  >
                    <InlineIcon i={<TbSquare />} />
                  </div>
                },
                {
                  key: "Circle",
                  content: <div
                    className="h-[1.5rem]"
                  >
                    <InlineIcon i={<TbCircle />} />
                  </div>
                },
              ]}
              onClick={(item) => {
                const center = props.getCenter();
                const tCenter = affineApply(affineTagToField, center);
                switch (item.key) {
                  case "Rectangle":
                    addRectNode(tCenter);
                    break;
                  case "Circle":
                    addCircleNode(tCenter);
                    break;
                }
              }}
            />
          </PopoverPanel>
        </Popover>
      </div>

      <div>
        <Popover className="relative">
          <PopoverButton as="div">
            <Button className="basic-palette-button p-1">
              <InlineIcon i={<SlMagnifier className="w-6 h-6" />} />
            </Button>
          </PopoverButton>
          <PopoverPanel anchor="right" transition className="flex flex-col transition duration-200 ease-out data-[closed]:-translate-x-1 data-[closed]:opacity-0">
            <ScaleView getCenter={props.getCenter} />
          </PopoverPanel>
        </Popover>
      </div>

      <div>
        <Popover className="relative">
          <PopoverButton as="div">
            <Button className="basic-palette-button p-1">
              <InlineIcon i={<IconTypeForColorTheme className="w-6 h-6" />} />
            </Button>
          </PopoverButton>
          <PopoverPanel anchor="right" transition className="flex flex-col transition duration-200 ease-out data-[closed]:-translate-x-1 data-[closed]:opacity-0">
            <ThemeSelector />
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  </div>

}