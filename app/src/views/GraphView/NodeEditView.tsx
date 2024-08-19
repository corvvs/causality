import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { getShapeForGraph, useGraph } from "../../stores/graph";
import { NodeSelection } from "./types";
import { ColorValue } from "../../types";
import { ColorPicker } from "../../components/ColorPicker";

export const NodeEditView = (props: {
  selectedNodes: NodeSelection;
}) => {
  const firstId = props.selectedNodes.ids[0];

  const {
    graph,
    updateNode,
  } = useGraph();
  const node = getShapeForGraph(firstId, graph);

  const color = node.labelColor || null;
  const setColor = (v: ColorValue | null) => {
    updateNode(firstId, {
      labelColor: v || undefined,
    });
  };

  return <div className="system-box p-4 gap-4 flex flex-col border-2 text-xs text-left">

    <div className="p-2 gap-2">
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


    <div className="p-2 gap-2">
      <Popover className="relative">
        <label>
          <PopoverButton>Text Color</PopoverButton>
          <PopoverPanel anchor="bottom" transition className="flex flex-col transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
            {({ close }) => (
              <ColorPicker currentColor={color} setColor={(v: ColorValue | null) => {
                setColor(v);
                close();
              }} />
            )}
          </PopoverPanel>
        </label>
        <div>
          <label>{color || "(none)"}</label>
        </div>
      </Popover>
    </div>


  </div>

};
