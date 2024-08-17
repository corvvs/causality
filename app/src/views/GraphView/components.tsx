import { SvgGraphShape } from "../../components/graph/SvgGraphShape";
import { useGraph } from "../../stores/graph";
import { CausalGraph } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { NodeSelection } from "./types";

export const NodeGroup: ComponentWithProps<
  {
    selectedNodes: NodeSelection;
    graph: CausalGraph;
  } &
  DraggableProps &
  SelectiveProps> = (props) => {
    const {
      graph,
    } = useGraph();

    return <>
      {
        graph.orders.map(id => {
          const shape = graph.shapeMap[id];
          return <SvgGraphShape
            key={shape.id}
            shape={shape}
            isSelected={!!props.selectedNodes.set[shape.id]}
            click={props.click}
            mouseDown={props.mouseDown}
            graph={graph}
          />;
        })
      }
    </>

  };



