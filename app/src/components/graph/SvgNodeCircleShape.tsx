import { CircleNode } from "../../types";
import { ComponentWithProps } from "../../types/components";
import { SvgNodeInnterText } from "./SvgNodeInnterText";
import { SvgNodeRectangleLikeSelectedShape } from "./SvgNodeRectangleLikeSelectedShape";
import { ShapeProps } from "./types";

export const SvgNodeCircleSelectedShape = SvgNodeRectangleLikeSelectedShape;

export const SvgNodeCircleShape: ComponentWithProps<ShapeProps<CircleNode>> = (props) => {
  const { shape } = props;

  const basePosition = shape.position;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;
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
        if (!props.click) { return; }
        props.click(e, shape);
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        if (!props.mouseDown) { return; }
        props.mouseDown(e, { target: "node", shapeId: shape.id, shape, });
        e.stopPropagation();
      }}
    />

    <SvgNodeInnterText node={shape} />
  </g>;
};
