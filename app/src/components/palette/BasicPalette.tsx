import { Button, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { InlineIcon } from "../InlineIcon"
import { FaRegCircle, FaShapes } from "react-icons/fa"
import { SlMagnifier } from "react-icons/sl"
import { ColorTheme, useColorTheme } from "../../stores/theme"
import { MdOutlineDarkMode, MdOutlineLightbulb, MdOutlineLightMode } from "react-icons/md"
import { ScaleView } from "../../views/GraphView/ScaleView"
import { Vector } from "../../types"
import { ComponentWithProps } from "../../types/components"
import { ThemeSelector } from "../ThemeSelector"
import { MultipleButtons } from "../MultipleButtons"
import { FaRegSquareFull } from "react-icons/fa6"

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

  const IconTypeForColorTheme = getIconTypeForColorTheme(appColorTheme);

  return <div className="basic-palette">
    <div className="grid grid-cols-1 grid-flow-row gap-2 p-1">
      <div>
        <Popover className="relative">
          <PopoverButton as="div">
            <Button className="basic-palette-button p-1">
              <InlineIcon i={<FaShapes className="w-6 h-6" />} />
            </Button>
          </PopoverButton>
          <PopoverPanel anchor="right" transition className="flex flex-col transition duration-200 ease-out data-[closed]:-translate-x-1 data-[closed]:opacity-0">
            <MultipleButtons
              items={[
                {
                  key: "Rectangle",
                  content: <div

                  >
                    <InlineIcon i={<FaRegSquareFull className="w-6 h-6" />} />
                  </div>
                },
                {
                  key: "Circle",
                  content: <div
                  >
                    <InlineIcon i={<FaRegCircle className="w-6 h-6" />} />
                  </div>
                },
              ]}
              onClick={(item) => {
                console.log(item);
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