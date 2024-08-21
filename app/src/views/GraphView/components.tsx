import { SvgGraphShape } from "../../components/graph/SvgGraphShape";
import { getShapeForGraph, useGraph } from "../../stores/graph";
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
          const shape = getShapeForGraph(id, graph);
          if (!shape) { return null; }
          return <SvgGraphShape
            key={shape.id}
            shape={shape}
            isSelected={!!props.selectedNodes.set[shape.id]}
            clickForSelection={props.clickForSelection}
            mouseDownForDragging={props.mouseDownForDragging}
            graph={graph}
          />;
        })
      }
    </>

  };



