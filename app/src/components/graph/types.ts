import { CausalGraph, GraphShape } from "../../types";

export type CommonProps<N extends GraphShape> = {
  shape: N;
  isSelected: boolean;
  graph: CausalGraph;
};
