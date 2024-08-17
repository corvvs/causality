import { RectangleNode } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { SvgNodeInnterText } from "./SvgNodeInnterText";
import { SvgNodeRectangleLikeSelectedShape } from "./SvgNodeRectangleLikeSelectedShape";
import { CommonProps } from "./types";

export const SvgNodeRectangleSelectedShape = SvgNodeRectangleLikeSelectedShape;

export const SvgNodeRectangleShape: ComponentWithProps<CommonProps<RectangleNode> & DraggableProps & SelectiveProps> = (props) => {
  const { shape: node } = props;

  const basePosition = node.position;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;
  return <g
    style={{
      transform: baseTranslation,
    }}
  >
    <rect
      x="0" y="0"
      width={node.size.width}
      height={node.size.height}
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
