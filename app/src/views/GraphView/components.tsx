import { sprintf } from "sprintf-js";
import { SvgNodeShape } from "../../components/graph/SvgNodeShape";
import { useDisplay } from "../../stores/display";
import { useGraph } from "../../stores/graph";
import { CausalDisplay, CausalGraph, GraphNode, Vector } from "../../types";
import { ComponentWithProps, DraggableProps } from "../../types/components";
import { DraggingTarget } from "./types";

export const QuadrandOverlay = () => {
  const {
    display,
  } = useDisplay();
  const quadrantTranslation = `translate(${display.origin.x}px, ${display.origin.y}px)`;
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

export const ScaleView: ComponentWithProps<{ getCenter: () => Vector | null }> = ({
  getCenter
}) => {
  const {
    display,
    scale,
    changeScale,
    scaleMin,
    scaleMax,
  } = useDisplay();

  return <div className="border-2 border-green-500">
    <input type="range" min={scaleMin} max={scaleMax} step="0.001" value={display.magnitude} onChange={(e) => {
      const center = getCenter();
      if (!center) { return; }
      changeScale(parseFloat(e.target.value), center);
      e.stopPropagation();
    }} />
    <p>{Math.floor(scale * 100 + 0.5)}%</p>
  </div>

};

export const SystemView = (props: {
  graph: CausalGraph;
  display: CausalDisplay;
  draggingNode: GraphNode | null;
  draggingOrigin: Vector | null;
  draggingTarget: DraggingTarget;
}) => {
  const scale = Math.pow(10, props.display.magnitude);
  return <div className="p-4 gap-4 flex flex-col border-2 border-green-500 text-xs text-left">
    <p>
      nodes: {props.graph.nodes.length}
    </p>
    <p>
      display.origin: {`(${props.display.origin.x}, ${props.display.origin.y})`}
    </p>
    <p>
      display.scale: {sprintf("%1.2f(%1.2f)", scale, props.display.magnitude)}
    </p>
    <p>
      draggingNode: {props.draggingNode?.id || "none"}
    </p>
    <p>
      draggingTarget: {props.draggingTarget || "none"}
    </p>
  </div>
};
