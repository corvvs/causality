import { GraphNode, GraphSegment, GraphShape, Size, Vector } from "../../types";

export type ReshaperType = "NW" | "NE" | "SE" | "SW" | "N" | "E" | "S" | "W" | "Start" | "End";
export type LinkerType = "N" | "E" | "S" | "W";

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
  NW: "nw-resize",
  NE: "ne-resize",
  SE: "se-resize",
  SW: "sw-resize",
  N: "n-resize",
  E: "e-resize",
  S: "s-resize",
  W: "w-resize",
  Start: "move",
  End: "move",
};

export type Linker = {
  /**
   * 中心位置(in タグワールド)
   */
  center: Vector;
  /**
   * 半径(in タグワールド)
   */
  radius: number;
  type: LinkerType;
};


export type DraggingTarget = "node" | "field" | null;

export type NodeSelection = {
  ids: number[];
  set: { [shapeId: number]: boolean; }
};

export type DraggableMatter = {
  target: "node";
  shapeId: number;
  shape: GraphNode;
} | {
  target: "segment";
  shapeId: number;
  shape: GraphSegment;
} | {
  target: "reshaper";
  shapeId: number;
  resizerType: ReshaperType;
  shape: GraphShape;
} | {
  target: "field";
};

type DraggingOperation = "Move" | "Reshape";

export type DraggingInfo = {
  target: null;
} | (DraggableMatter & {
  operation: DraggingOperation;
  origin: Vector;
  size?: Size;
});
