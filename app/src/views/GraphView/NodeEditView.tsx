import { useGraph } from "../../stores/graph";
import { NodeSelection } from "./types";

export const NodeEditView = (props: {
  selectedNodes: NodeSelection;
}) => {
  const firstId = props.selectedNodes.ids[0];

  const {
    graph,
    updateNode,
  } = useGraph();

  const node = graph.nodes[firstId];

  return <div className="system-box p-4 gap-4 flex flex-col border-2 bg-black/50 text-xs text-left">

    <div className="edit-box p-2 gap-2">
      <label>Text</label>
      <div>
        <input
          type="text"
          value={node.label || ""}
          onChange={(e) => {
            updateNode(firstId, {
              label: e.target.value
            });
          }}
        />
      </div>
    </div>
  </div>

};
