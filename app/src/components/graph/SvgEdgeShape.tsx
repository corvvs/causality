import { getNodeCenter } from "../../libs/shape";
import { vectorMid } from "../../libs/vector";
import { GraphEdge, isGraphNode } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { CommonProps } from "./types";

export const SvgEdgeShape: ComponentWithProps<CommonProps<GraphEdge> & DraggableProps & SelectiveProps> = (props) => {
  const {
    shape,
    graph,
  } = props;

  const startNode = graph.shapeMap[shape.startNodeId];
  const endNode = graph.shapeMap[shape.endNodeId];
  if (!isGraphNode(startNode) || !isGraphNode(endNode)) { return null; }

  const center = vectorMid(startNode.position, endNode.position);
  const basePosition = center;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;

  const startCenter = getNodeCenter(startNode);
  const endCenter = getNodeCenter(endNode);

  return <g
    style={{
      transform: baseTranslation,
    }}
  >
    <line
      x1={startCenter.x - center.x}
      y1={startCenter.y - center.y}
      x2={endCenter.x - center.x}
      y2={endCenter.y - center.y}
      onClick={(e) => {
        if (!props.click) { return; }
        props.click(e, shape);
        e.stopPropagation();
      }}
    />
  </g>;
};
