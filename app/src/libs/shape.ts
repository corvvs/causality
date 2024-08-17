import { GraphNode, Vector } from "../types";

export function getNodeCenter(node: GraphNode): Vector {
  return {
    x: node.position.x + node.size.width / 2,
    y: node.position.y + node.size.height / 2
  };
}