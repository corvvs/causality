import { SvgNodeSelectedShape } from "../../components/graph/SvgNodeShape";
import { useGraph } from "../../stores/graph";
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
      const node = graph.nodes[id];
      return <SvgNodeSelectedShape key={node.id} node={node} {...props} />
    })}
  </g>
};
