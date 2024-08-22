import { wrapForTouchGeneric } from "../../libs/touch";
import { CircleNode } from "../../types";
import { ComponentWithProps } from "../../types/components";
import { DraggableMatter } from "../../views/GraphView/types";
import { SvgNodeInnterText } from "./SvgNodeInnterText";
import { SvgNodeRectangleLikeSelectedShape } from "./SvgNodeRectangleLikeSelectedShape";
import { ShapeProps } from "./types";

export const SvgNodeCircleSelectedShape = SvgNodeRectangleLikeSelectedShape;

export const SvgNodeCircleShape: ComponentWithProps<ShapeProps<CircleNode>> = (props) => {
  const { shape, mouseDownForDragging } = props;

  const basePosition = shape.position;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;
  const draggableMatter: DraggableMatter = { target: "node", shapeId: shape.id, shape };
  return <g
    style={{
      transform: baseTranslation,
    }}
  >
    <ellipse
      cx={shape.size.width / 2} cy={shape.size.height / 2}
      rx={shape.size.width / 2}
      ry={shape.size.height / 2}
      fill="transparent"
      strokeWidth={shape.shape.line.lineWidth}
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
