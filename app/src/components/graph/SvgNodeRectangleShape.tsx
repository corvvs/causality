import { wrapForTouchGeneric } from "../../libs/touch";
import { getLineWidth, RectangleNode } from "../../types";
import { ComponentWithProps } from "../../types/components";
import { DraggableMatter } from "../../views/GraphView/types";
import { SvgNodeInnterText } from "./SvgNodeInnterText";
import { SvgNodeRectangleLikeSelectedShape } from "./SvgNodeRectangleLikeSelectedShape";
import { ShapeProps } from "./types";

export const SvgNodeRectangleSelectedShape = SvgNodeRectangleLikeSelectedShape;

export const SvgNodeRectangleShape: ComponentWithProps<ShapeProps<RectangleNode>> = (props) => {
  const { shape, mouseDownForDragging } = props;

  const basePosition = shape.position;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;
  const draggableMatter: DraggableMatter = { target: "node", shapeId: shape.id, shape };
  return <g
    style={{
      transform: baseTranslation,
    }}
  >
    <rect className="causality"
      x="0" y="0"
      width={shape.size.width}
      height={shape.size.height}
      fill="transparent"
      strokeWidth={getLineWidth(shape)}
      onClick={(e) => {
        if (!props.clickForSelection) { return; }
        props.clickForSelection(e, shape);
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        if (!mouseDownForDragging) { return; }
        mouseDownForDragging(e, draggableMatter);
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        if (!mouseDownForDragging) { return; }
        wrapForTouchGeneric((e) => mouseDownForDragging(e, draggableMatter))(e);
        e.stopPropagation();
      }}
    />

    <SvgNodeInnterText node={shape} />
  </g>;
};
