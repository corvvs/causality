import { CircleNode, GraphEdge, GraphShape, RectangleNode } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { SvgEdgeShape } from "./SvgEdgeShape";
import { SvgNodeCircleSelectedShape, SvgNodeCircleShape } from "./SvgNodeCircleShape";
import { SvgNodeRectangleSelectedShape, SvgNodeRectangleShape } from "./SvgNodeRectangleShape";
import { CommonProps } from "./types";

export const SvgGraphShape: ComponentWithProps<CommonProps<GraphShape> & DraggableProps & SelectiveProps> = (props) => {
  switch (props.shape.shapeType) {
    case "Rectangle":
      return <SvgNodeRectangleShape {...props} shape={props.shape as RectangleNode} />;
    case "Circle":
      return <SvgNodeCircleShape {...props} shape={props.shape as CircleNode} />;
    case "Edge":
      return <SvgEdgeShape {...props} shape={props.shape as GraphEdge} />;
    default:
      return null;
  }
};

export const SvgNodeSelectedShape: ComponentWithProps<{ node: GraphShape } & DraggableProps> = (props) => {
  switch (props.node.shapeType) {
    case "Rectangle":
      return <SvgNodeRectangleSelectedShape {...props} node={props.node as RectangleNode} />;
    case "Circle":
      return <SvgNodeCircleSelectedShape {...props} node={props.node as CircleNode} />;
    default:
      return null;
  }
}
