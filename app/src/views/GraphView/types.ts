import { Size, Vector } from "../../types";

export type ReshaperType = "NW" | "NE" | "SE" | "SW" | "N" | "E" | "S" | "W" | "Start" | "End";

/**
 * リサイザー要素の物理情報
 */
export type Reshaper = {
  /**
   * 中心位置(in タグワールド)
   */
  center: Vector;
  /**
   * 物理サイズ(in タグワールド)
   */
  size: Size;
  type: ReshaperType;
};

export const ReshaperCursor = {
  NW: "cursor-nw-resize",
  NE: "cursor-ne-resize",
  SE: "cursor-se-resize",
  SW: "cursor-sw-resize",
  N: "cursor-n-resize",
  E: "cursor-e-resize",
  S: "cursor-s-resize",
  W: "cursor-w-resize",
  Start: "cursor-move",
  End: "cursor-move",
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
  target: "reshaper";
  nodeId: number;
  resizerType: ReshaperType;
} | {
  target: "field";
};

export type DraggingInfo = {
  target: null;
} | (DraggableMatter & {
  origin: Vector;
  size?: Size;
});
