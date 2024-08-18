import { CausalGraph, GraphShape } from "../../types";
import { DraggableProps, SelectiveProps } from "../../types/components";

export type CommonProps<N extends GraphShape> = {
  shape: N;
  isSelected: boolean;
  graph: CausalGraph;
};

export type ShapeProps<N extends GraphShape> = CommonProps<N> & DraggableProps & SelectiveProps;
