import { GraphNode, RectangleNode } from "../../types";

type HTMLProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
type ComponentWithProps<T extends object> = React.FC<T & HTMLProps>;
type DraggableProps = {
  mouseDown?: (e: React.MouseEvent<SVGElement>, node: GraphNode) => void;
  mouseUp?: (e: React.MouseEvent<SVGElement>, node: GraphNode) => void;
  mouseMove?: (e: React.MouseEvent<SVGElement>, node: GraphNode) => void;
};

const SvgNodeRectangleShape: ComponentWithProps<{ node: RectangleNode } & DraggableProps> = (props) => {
  const { node } = props;
  return <rect
    x={node.position.x}
    y={node.position.y}
    width={node.shape.width}
    height={node.shape.height}
    fill="transparent"
    stroke="white"
    strokeWidth={node.shape.line.lineWidth}
    onMouseDown={(e) => {
      // console.log("onMouseDown:", e);
      if (props.mouseDown) {
        props.mouseDown(e, node);
      }
    }}
    onMouseUp={(e) => {
      // console.log("onMouseUp:", e);
      if (props.mouseUp) {
        props.mouseUp(e, node);
      }
    }}
    onMouseMove={(e) => {
      // console.log("onMouseMove:", e);
      if (props.mouseMove) {
        props.mouseMove(e, node);
      }
    }}
  />;
};

export const SvgNodeShape: ComponentWithProps<{ node: GraphNode; } & DraggableProps> = (props) => {
  switch (props.node.nodeType) {
    case "Rectangle":
      return <SvgNodeRectangleShape {...props} node={props.node as RectangleNode} />;
    default:
      return null;
  }
};
