import { sprintf } from "sprintf-js";
import { SvgNodeShape } from "../../components/graph/SvgNodeShape";
import { useDisplay } from "../../stores/display";
import { useGraph } from "../../stores/graph";
import { CausalDisplay, CausalGraph, GraphNode, Vector } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { DraggingInfo } from "./types";

export const NodeGroup: ComponentWithProps<
  {
    selectedNodes: { [key: string]: GraphNode };
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
            isSelected={!!props.selectedNodes[node.id]}
            click={props.click}
            mouseDown={props.mouseDown}
          />;
        })
      }
    </>

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
  selectedNodes: { [key: string]: GraphNode };
  draggingInfo: DraggingInfo;
}) => {
  const scale = Math.pow(10, props.display.magnitude);
  return <div className="p-4 gap-4 flex flex-col border-2 border-green-500 text-xs text-left">
    <p>
      nodes: {props.graph.nodeOrder.length}
    </p>
    <p>
      display.origin: {`(${props.display.origin.x}, ${props.display.origin.y})`}
    </p>
    <p>
      display.scale: {sprintf("%1.2f(%1.2f)", scale, props.display.magnitude)}
    </p>
    <p>
      selectedNodes: {Object.keys(props.selectedNodes).length}
    </p>
    <p>
      draggingNode: {props.draggingInfo.target === "node" ? props.draggingInfo.nodeId : "none"}
    </p>
    <p>
      draggingTarget: {JSON.stringify(props.draggingInfo)}
    </p>
  </div>
};
