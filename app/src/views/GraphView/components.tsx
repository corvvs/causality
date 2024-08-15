import { SvgNodeShape } from "../../components/graph/SvgNodeShape";
import { useGraph } from "../../stores/graph";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { NodeSelection } from "./types";

export const NodeGroup: ComponentWithProps<
  {
    selectedNodes: NodeSelection;
  } &
  DraggableProps &
  SelectiveProps> = (props) => {
    const {
      graph,
    } = useGraph();

    return <>
      {
        graph.nodeOrder.map(nodeId => {
          const node = graph.nodes[nodeId];
          return <SvgNodeShape
            key={node.id}
            node={node}
            isSelected={!!props.selectedNodes.set[node.id]}
            click={props.click}
            mouseDown={props.mouseDown}
          />;
        })
      }
    </>

  };



