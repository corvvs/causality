import { SvgNodeSelectedShape } from "../../components/graph/SvgGraphShape";
import { getShapeForGraph, useGraph } from "../../stores/graph";
import { DraggableProps } from "../../types/components";
import { NodeSelection } from "./types";

export const SelectedLayer = (props: {
  selectedNodes: NodeSelection;
} & DraggableProps) => {
  const {
    graph
  } = useGraph();


  return <g>
    {props.selectedNodes.ids.map((id) => {
      const shape = getShapeForGraph(id, graph);
      return <SvgNodeSelectedShape key={shape.id} graph={graph} shape={shape} {...props} />
    })}
  </g>
};
