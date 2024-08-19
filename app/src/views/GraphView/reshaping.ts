import { isHit } from "../../libs/hit";
import { getShapeForGraph } from "../../stores/graph";
import { MyModifierKey } from "../../stores/modifier_keys";
import { CausalGraph, GraphNode, GraphSegment, GraphShape, ShapeId, Vector } from "../../types";
import { DraggingInfo } from "./types";


// TODO: 空間分割などによる計算量の効率化
function findNodeToLink(self: GraphShape, r: Vector, graph: CausalGraph): ShapeId | null {
  for (let i = graph.orders.length - 1; i >= 0; i--) {
    if (graph.orders[i] === self.id) { continue; }
    const s = getShapeForGraph(graph.orders[i], graph);
    if (isHit(r, s)) {
      return s.id;
    }
  }
  return null;
}

/**
 * ノードのリシェーピング
 */
export function reshapeRectangleLikeNode(props: {
  shape: GraphNode;
  rx: number;
  ry: number;
  scale: number;
  draggingInfo: DraggingInfo;
  modifierKey: MyModifierKey
  updateNode: (shapeId: number, node: Partial<GraphNode>) => void;
}) {
  const {
    shape: n,
    rx, ry, scale,
    draggingInfo,
    updateNode,
    modifierKey,
  } = props;
  if (draggingInfo.target !== "reshaper") { return; }
  if (!draggingInfo.origin) { return; }
  const xTo = rx / scale;
  const yTo = ry / scale;
  switch (draggingInfo.resizerType) {
    case "N": {
      const yFrom = n.position.y + n.size.height;
      let w = n.size.width;
      let h = yFrom - yTo
      if (modifierKey.shift) {
        w = h;
      }
      if (w < 0) { w = 0; }
      if (h < 0) { h = 0; }
      if (w <= 0 && h <= 0) { return; }
      const dw = w - n.size.width;
      const dh = h - n.size.height;
      updateNode(n.id, {
        position: { x: n.position.x - dw / 2, y: n.position.y - dh },
        size: { width: w, height: h }
      });
      break;
    }
    case "E": {
      let w = xTo - n.position.x;
      let h = n.size.height;
      if (modifierKey.shift) {
        h = w;
      }
      if (w < 0) { w = 0; }
      if (h < 0) { h = 0; }
      if (w <= 0 && h <= 0) { return; }
      const dh = h - n.size.height;
      updateNode(n.id, {
        position: { x: n.position.x, y: n.position.y - dh / 2 },
        size: { width: w, height: h },
      });
      break;
    }
    case "S": {
      let w = n.size.width;
      let h = yTo - n.position.y;
      if (modifierKey.shift) {
        w = h;
      }
      if (w < 0) { w = 0; }
      if (h < 0) { h = 0; }
      if (w <= 0 && h <= 0) { return; }
      const dw = w - n.size.width;
      updateNode(n.id, {
        position: { x: n.position.x - dw / 2, y: n.position.y },
        size: { width: w, height: h }
      });
      break;
    }
    case "W": {
      const xFrom = n.position.x + n.size.width;
      let w = xFrom - xTo
      let h = n.size.height;
      if (modifierKey.shift) {
        h = w;
      }
      if (w < 0) { w = 0; }
      if (h < 0) { h = 0; }
      if (w <= 0 && h <= 0) { return; }
      const dw = w - n.size.width;
      const dh = h - n.size.height;
      updateNode(n.id, {
        position: { x: n.position.x - dw, y: n.position.y - dh / 2 },
        size: { width: w, height: h }
      });
      break;
    }
    case "NW": {
      const xFrom = n.position.x + n.size.width;
      const yFrom = n.position.y + n.size.height;
      let w = xFrom - xTo;
      let h = yFrom - yTo
      if (modifierKey.shift) {
        if (w > h) { h = w; }
        if (h > w) { w = h; }
      }
      if (w < 0) { w = 0; }
      if (h < 0) { h = 0; }
      if (w <= 0 && h <= 0) { return; }
      const dw = w - n.size.width;
      const dh = h - n.size.height;
      updateNode(n.id, {
        position: { x: n.position.x - dw, y: n.position.y - dh },
        size: { width: w, height: h }
      });
      break;
    }
    case "NE": {
      let w = xTo - n.position.x;
      let h = n.size.height - (yTo - n.position.y);
      if (modifierKey.shift) {
        if (w > h) { h = w; }
        if (h > w) { w = h; }
      }
      if (w < 0) { w = 0; }
      if (h < 0) { h = 0; }
      if (w <= 0 && h <= 0) { return; }
      const dh = h - n.size.height;
      updateNode(n.id, {
        position: { x: n.position.x, y: n.position.y - dh },
        size: { width: w, height: h }
      });
      break;
    }
    case "SW": {
      let w = n.size.width - (xTo - n.position.x);
      let h = yTo - n.position.y;
      if (modifierKey.shift) {
        if (w > h) { h = w; }
        if (h > w) { w = h; }
      }
      if (w < 0) { w = 0; }
      if (h < 0) { h = 0; }
      if (w <= 0 && h <= 0) { return; }
      const dw = w - n.size.width;
      updateNode(n.id, {
        position: { x: n.position.x - dw, y: n.position.y },
        size: { width: w, height: h }
      });
      break;
    }
    case "SE": {
      let w = xTo - n.position.x;
      let h = yTo - n.position.y;
      if (modifierKey.shift) {
        if (w > h) { h = w; }
        if (h > w) { w = h; }
      }
      if (w < 0) { w = 0; }
      if (h < 0) { h = 0; }
      if (w <= 0 && h <= 0) { return; }
      updateNode(n.id, { size: { width: w, height: h } });
      break;
    }
  }
}

/**
 * 線分のリシェーピング
 */
export function reshapeSegment(props: {
  shape: GraphSegment;
  rx: number;
  ry: number;
  scale: number;
  draggingInfo: DraggingInfo;
  modifierKey: MyModifierKey;
  graph: CausalGraph;
  updateSegment: (id: number, node: Partial<GraphSegment>) => void;
}) {
  const {
    shape: n,
    rx, ry, scale,
    draggingInfo,
    updateSegment,
  } = props;
  if (draggingInfo.target !== "reshaper") { return; }
  if (!draggingInfo.origin) { return; }
  const x = rx / scale;
  const y = ry / scale;
  const v: Vector = { x, y };
  const shapeIdToLink = findNodeToLink(n, v, props.graph);
  switch (draggingInfo.resizerType) {
    case "Start": {
      if (typeof shapeIdToLink === "number") {
        updateSegment(n.id, {
          starting: shapeIdToLink,
        });
      } else {
        updateSegment(n.id, {
          starting: v
        });
      }
      break;
    }
    case "End": {
      if (typeof shapeIdToLink === "number") {
        updateSegment(n.id, {
          ending: shapeIdToLink,
        });
      } else {
        updateSegment(n.id, {
          ending: v
        });
        }
      break;
    }

  }
}