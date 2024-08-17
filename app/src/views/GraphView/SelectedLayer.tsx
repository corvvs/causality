import { SvgNodeSelectedShape } from "../../components/graph/SvgGraphShape";
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
      const shape = graph.shapeMap[id];
      return <SvgNodeSelectedShape key={shape.id} node={shape} {...props} />
    })}
  </g>
};
