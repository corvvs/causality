import { ResizerType } from "../../components/graph/SvgNodeRectangleShape";
import { Vector } from "../../types";

export type DraggingTarget = "node" | "field" | null;

export type NodeSelection = {
  ids: string[];
  set: { [nodeId: string]: boolean; }
};

export type DraggableMatter = {
  target: "node";
  nodeId: string;
} | {
  target: "nodeResizer";
  nodeId: string;
  resizerType: ResizerType;
} | {
  target: "field";
};

export type DraggingInfo = {
  target: null;
} | (DraggableMatter & {
  origin: Vector;
});
