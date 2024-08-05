import { sprintf } from "sprintf-js";
import { GraphNode, RectangleNode } from "../../types";
import { ComponentWithProps, DraggableProps } from "../../types/components";


const SvgNodeInnterText: ComponentWithProps<{ node: RectangleNode }> = (props) => {
  const { node } = props;
  return <foreignObject
    x="0" y="0"
    width={node.shape.width}
    height={node.shape.height}
    style={{
      pointerEvents: "none"
    }}
  >
    <div
      className="w-full h-full flex flex-col justify-center items-center text-xs"
    >
      <p>{sprintf("(%1.2f, %1.2f)", node.position.x, node.position.y)}</p>
      <p>{node.id}</p>
    </div>
  </foreignObject>

};

const SvgNodeRectangleShape: ComponentWithProps<{ node: RectangleNode } & DraggableProps> = (props) => {
  const { node } = props;

  const basePosition = node.position;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;
  const baseTransform = `${baseTranslation}`;

  return <g
    style={{
      transform: baseTransform,
    }}
  >
    <rect
      x="0" y="0"
      width={node.shape.width}
      height={node.shape.height}
      fill="transparent"
      stroke="white"
      strokeWidth={node.shape.line.lineWidth}
      onMouseDown={(e) => {
        if (props.mouseDown) {
          props.mouseDown(e, node);
          e.stopPropagation();
        }
      }}
    />

    <SvgNodeInnterText node={node} />

  </g>;
};

export const SvgNodeShape: ComponentWithProps<{ node: GraphNode; } & DraggableProps> = (props) => {
  switch (props.node.nodeType) {
    case "Rectangle":
      return <SvgNodeRectangleShape {...props} node={props.node as RectangleNode} />;
    default:
      return null;
  }
};
