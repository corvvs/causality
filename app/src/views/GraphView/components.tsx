import { SvgNodeShape } from "../../components/graph/SvgNodeShape";
import { useDisplay } from "../../stores/display";
import { useGraph } from "../../stores/graph";
import { ComponentWithProps, DraggableProps } from "../../types/components";

export const QuadrandCross = () => {
  const {
    display,
  } = useDisplay(); const quadrantTranslation = `translate(${display.origin.x}px, ${display.origin.y}px)`;
  return <g
    style={{
      transform: quadrantTranslation,
    }}
  >
    <line
      x1={-100000} y1={0} x2={100000} y2={0}
      stroke="white"
    />
    <line
      x1={0} y1={-100000} x2={0} y2={100000}
      stroke="white"
    />
  </g>

};

export const NodeGroup: ComponentWithProps<DraggableProps> = (props) => {
  const {
    graph,
  } = useGraph();
  const {
    transformFieldToBrowser,
  } = useDisplay();

  return <g
    style={{
      transform: transformFieldToBrowser,
    }}
  >
    {
      graph.nodes.map(node => <SvgNodeShape
        key={node.id} node={node}
        mouseDown={props.mouseDown}
      />)
    }
  </g>

};
