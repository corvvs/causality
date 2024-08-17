import { CircleNode } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { SvgNodeInnterText } from "./SvgNodeInnterText";
import { SvgNodeRectangleLikeSelectedShape } from "./SvgNodeRectangleLikeSelectedShape";
import { CommonProps } from "./types";

export const SvgNodeCircleSelectedShape = SvgNodeRectangleLikeSelectedShape;

export const SvgNodeCircleShape: ComponentWithProps<CommonProps<CircleNode> & DraggableProps & SelectiveProps> = (props) => {
  const { shape: node } = props;

  const basePosition = node.position;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;
  return <g
    style={{
      transform: baseTranslation,
    }}
  >
    <ellipse
      cx={node.size.width / 2} cy={node.size.height / 2}
      rx={node.size.width / 2}
      ry={node.size.height / 2}
      fill="transparent"
      strokeWidth={node.shape.line.lineWidth}
      onClick={(e) => {
        if (!props.click) { return; }
        props.click(e, node);
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        if (!props.mouseDown) { return; }
        props.mouseDown(e, { target: "node", nodeId: node.id });
        e.stopPropagation();
      }}
    />

    <SvgNodeInnterText node={node} />
  </g>;
};
