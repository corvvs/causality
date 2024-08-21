import { RectangleNode } from "../../types";
import { ComponentWithProps } from "../../types/components";
import { SvgNodeInnterText } from "./SvgNodeInnterText";
import { SvgNodeRectangleLikeSelectedShape } from "./SvgNodeRectangleLikeSelectedShape";
import { ShapeProps } from "./types";

export const SvgNodeRectangleSelectedShape = SvgNodeRectangleLikeSelectedShape;

export const SvgNodeRectangleShape: ComponentWithProps<ShapeProps<RectangleNode>> = (props) => {
  const { shape } = props;

  const basePosition = shape.position;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;
  return <g
    style={{
      transform: baseTranslation,
    }}
  >
    <rect
      x="0" y="0"
      width={shape.size.width}
      height={shape.size.height}
      fill="transparent"
      strokeWidth={shape.shape.line.lineWidth}
      onClick={(e) => {
        if (!props.clickForSelection) { return; }
        props.clickForSelection(e, shape);
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        if (!props.mouseDownForDragging) { return; }
        props.mouseDownForDragging(e, { target: "node", shapeId: shape.id, shape });
        e.stopPropagation();
      }}
    />

    <SvgNodeInnterText node={shape} />
  </g>;
};
