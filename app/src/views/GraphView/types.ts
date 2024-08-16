import { Size, Vector } from "../../types";

export type ResizerType = "NW" | "NE" | "SE" | "SW" | "N" | "E" | "S" | "W";
export type Resizer = {
  center: Vector;
  size: Size;
  type: ResizerType;
};

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
