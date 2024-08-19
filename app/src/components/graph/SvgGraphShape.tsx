import { CausalGraph, CircleNode, GraphSegment, GraphShape, RectangleNode } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { SvgNodeCircleSelectedShape, SvgNodeCircleShape } from "./SvgNodeCircleShape";
import { SvgNodeRectangleSelectedShape, SvgNodeRectangleShape } from "./SvgNodeRectangleShape";
import { SvgSegmentSelectedShape, SegmentShape } from "./SegmentShape";
import { CommonProps } from "./types";

export const SvgGraphShape: ComponentWithProps<CommonProps<GraphShape> & DraggableProps & SelectiveProps> = (props) => {
  switch (props.shape.shapeType) {
    case "Rectangle":
      return <SvgNodeRectangleShape {...props} shape={props.shape as RectangleNode} />;
    case "Circle":
      return <SvgNodeCircleShape {...props} shape={props.shape as CircleNode} />;
    case "Segment":
      return <SegmentShape {...props} shape={props.shape as GraphSegment} />;
    default:
      return null;
  }
};

export const SvgNodeSelectedShape: ComponentWithProps<{ shape: GraphShape; graph: CausalGraph } & DraggableProps> = (props) => {
  switch (props.shape.shapeType) {
    case "Rectangle":
      return <SvgNodeRectangleSelectedShape {...props} shape={props.shape as RectangleNode} />;
    case "Circle":
      return <SvgNodeCircleSelectedShape {...props} shape={props.shape as CircleNode} />;
    default:
      return <SvgSegmentSelectedShape {...props} shape={props.shape as GraphSegment} />;
  }
}
