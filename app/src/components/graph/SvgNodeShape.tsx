import { CircleNode, GraphNode, RectangleNode } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { SvgNodeCircleSelectedShape, SvgNodeCircleShape } from "./SvgNodeCircleShape";
import { SvgNodeRectangleSelectedShape, SvgNodeRectangleShape } from "./SvgNodeRectangleShape";
import { CommonProps } from "./types";

export const SvgNodeShape: ComponentWithProps<CommonProps<GraphNode> & DraggableProps & SelectiveProps> = (props) => {
  switch (props.node.nodeType) {
    case "Rectangle":
      return <SvgNodeRectangleShape {...props} node={props.node as RectangleNode} />;
    case "Circle":
      return <SvgNodeCircleShape {...props} node={props.node as CircleNode} />;
    default:
      return null;
  }
};

export const SvgNodeSelectedShape: ComponentWithProps<{ node: GraphNode } & DraggableProps> = (props) => {
  switch (props.node.nodeType) {
    case "Rectangle":
      return <SvgNodeRectangleSelectedShape {...props} node={props.node as RectangleNode} />;
    case "Circle":
      return <SvgNodeCircleSelectedShape {...props} node={props.node as CircleNode} />;
    default:
      return null;
  }
}
