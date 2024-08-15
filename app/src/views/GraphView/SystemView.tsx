import { sprintf } from "sprintf-js";
import { useDisplay } from "../../stores/display";
import { useGraph } from "../../stores/graph";
import { DraggingInfo, NodeSelection } from "./types";
import { useColorTheme } from "../../stores/theme";

export const SystemView = (props: {
  selectedNodes: NodeSelection;
  draggingInfo: DraggingInfo;
}) => {
  const {
    graph,
  } = useGraph();
  const {
    display,
  } = useDisplay();
  const {
    appColorTheme,
  } = useColorTheme();
  const scale = Math.pow(10, display.magnitude);
  return <div className="system-box p-4 gap-4 flex flex-col border-2 text-xs text-left">
    <p>
      nodes: {graph.nodeOrder.length}
    </p>
    <p>
      display.origin: {sprintf("(%1.2f, %1.2f)", display.origin.x, display.origin.y)}
    </p>
    <p>
      display.scale: {sprintf("%1.2f(%1.2f)", scale, display.magnitude)}
    </p>
    <p>
      selectedNodes: {props.selectedNodes.ids.length}
    </p>
    <p>
      draggingNode: {props.draggingInfo.target === "node" ? props.draggingInfo.nodeId : "none"}
    </p>
    <p>
      draggingTarget: {JSON.stringify(props.draggingInfo)}
    </p>
    <p>
      appColorTheme: {appColorTheme}
    </p>
  </div>
};
