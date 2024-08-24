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
import { PiLineSegment } from "react-icons/pi"
import { BsGithub } from "react-icons/bs"

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

const ShapesSubPalette: ComponentWithProps<{
  getCenter: () => Vector;
}> = (props) => {
  const {
    affineTagToField,
  } = useDisplay();

  const {
    addRectNode,
    addCircleNode,
    addSegment,
  } = useGraph();

  return <Popover className="relative">
    <PopoverButton as="div">
      <Button className="canvas-palette-button p-1">
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
          {
            key: "Segment",
            content: <div
              className="h-[1.5rem]"
            >
              <InlineIcon i={<PiLineSegment />} />
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
            case "Segment":
              addSegment(tCenter);
              break;
          }
        }}
      />
    </PopoverPanel>
  </Popover>
};

const ScaleSubPalette: ComponentWithProps<{
  getCenter: () => Vector;
}> = (props) => {
  return <Popover className="relative">
    <PopoverButton as="div">
      <Button className="canvas-palette-button p-1">
        <InlineIcon i={<SlMagnifier className="w-6 h-6" />} />
      </Button>
    </PopoverButton>
    <PopoverPanel anchor="right" transition className="flex flex-col transition duration-200 ease-out data-[closed]:-translate-x-1 data-[closed]:opacity-0">
      <ScaleView getCenter={props.getCenter} />
    </PopoverPanel>
  </Popover>
}

const ThemeSubPalette: ComponentWithProps<{
  getCenter: () => Vector;
}> = () => {
  const {
    appColorTheme,
  } = useColorTheme();
  const IconTypeForColorTheme = getIconTypeForColorTheme(appColorTheme);
  return <Popover className="relative">
    <PopoverButton as="div">
      <Button className="canvas-palette-button p-1">
        <InlineIcon i={<IconTypeForColorTheme className="w-6 h-6" />} />
      </Button>
    </PopoverButton>
    <PopoverPanel anchor="right" transition className="flex flex-col transition duration-200 ease-out data-[closed]:-translate-x-1 data-[closed]:opacity-0">
      <ThemeSelector />
    </PopoverPanel>
  </Popover>

}

export const CanvasPalette: ComponentWithProps<{
  getCenter: () => Vector;
}> = (props) => {

  return <div
    className="canvas-palette"
    onMouseUp={(e) => {
      e.stopPropagation();
    }}
  >
    <div className="grid grid-cols-1 grid-flow-row gap-2 p-1 pb-4">
      <div title="Add a Shape">
        <ShapesSubPalette getCenter={props.getCenter} />
      </div>

      <div title="Zooming">
        <ScaleSubPalette getCenter={props.getCenter} />
      </div>

      <div title="Color Theme">
        <ThemeSubPalette getCenter={props.getCenter} />
      </div>

      <div title="GitHub">
        <a href="https://github.com/corvvs/causality">
          <InlineIcon i={<BsGithub className="w-6 h-6" />} />
        </a>
      </div>
    </div>
  </div>
}
