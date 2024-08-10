import { GraphNode } from "../../types";

export type CommonProps<N extends GraphNode> = {
  node: N;
  isSelected: boolean;
};
