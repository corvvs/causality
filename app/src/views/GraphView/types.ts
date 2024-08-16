import { ResizerType } from "../../components/graph/SvgNodeRectangleShape";
import { Vector } from "../../types";

export type DraggingTarget = "node" | "field" | null;

export type NodeSelection = {
  ids: number[];
  set: { [nodeId: number]: boolean; }
};

export type DraggableMatter = {
  target: "node";
  nodeId: number;
} | {
  target: "nodeResizer";
  nodeId: number;
  resizerType: ResizerType;
} | {
  target: "field";
};

export type DraggingInfo = {
  target: null;
} | (DraggableMatter & {
  origin: Vector;
});
