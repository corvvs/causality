import { SvgNodeSelectedShape } from "../../components/graph/SvgNodeShape";
import { useGraph } from "../../stores/graph";
import { GraphNode } from "../../types";
import { DraggableProps } from "../../types/components";

export const SelectedLayer = (props: {
  selectedNodes: {
    [nodeId: string]: GraphNode;
  }
} & DraggableProps) => {
  const {
    graph
  } = useGraph();


  return <g>
    {Object.keys(props.selectedNodes).map((id) => {
      const node = graph.nodes[id];
      return <SvgNodeSelectedShape key={node.id} node={node} {...props} />
    })}
  </g>
};
