import { useEffect, useRef, useState } from "react";
import { useGraph } from "../stores/graph";
import { useDisplay } from "../stores/display";
import { CausalGraph, GraphNode, GraphSegment, isGraphNode, isGraphSegment, Vector } from "../types";
import { useOnPinch, useRerenderOnResize } from "../hooks/events";
import { NodeGroup } from "./GraphView/components";
import { GridOverlay } from "./GraphView/GridOverlay";
import { DraggingInfo, NodeSelection } from "./GraphView/types";
import { SelectedLayer } from "./GraphView/SelectedLayer";
import { NodeEditView } from "./GraphView/NodeEditView";
import { SystemView } from "./GraphView/SystemView";
import { MyModifierKey, useModifierKey } from "../stores/modifier_keys";
import { BasicPalette } from "../components/palette/BasicPalette";
import { positionForBond } from "../components/graph/SvgSegmentShape";

function reshapeRectangleLikeNode(props: {
  shape: GraphNode;
  rx: number;
  ry: number;
  scale: number;
  draggingInfo: DraggingInfo;
  modifierKey: MyModifierKey
  updateNode: (nodeId: number, node: Partial<GraphNode>) => void;
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

function reshapeSegment(props: {
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
  switch (draggingInfo.resizerType) {
    case "Start": {
      const x = rx / scale;
      const y = ry / scale;
      updateSegment(n.id, {
        starting: { x, y }
      });
      break;
    }
    case "End": {
      const x = rx / scale;
      const y = ry / scale;
      updateSegment(n.id, {
        ending: { x, y }
      });
      break;
    }

  }
}

export const GraphView = () => {
  const {
    updateNode,
    updateSegment,
    graph,
  } = useGraph();
  const {
    display,
    scale,
    moveOrigin,
    changeScale,
    transformFieldToBrowser,
  } = useDisplay();

  const {
    modifierKey,
  } = useModifierKey();

  const svgRef = useRef<SVGSVGElement | null>(null);
  useRerenderOnResize(svgRef);


  const [selectedNodes, setSelectedNodes] = useState<NodeSelection>({
    ids: [],
    set: {},
  });
  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo>({
    target: null,
  });

  const cursor = draggingInfo.target === "node" ? { cursor: "grab" } : {};
  const style = {
    ...cursor,
  };


  useEffect(() => {
    window.requestAnimationFrame
    const handleMouseMove = (event: MouseEvent) => {
      if (!draggingInfo.target) { return; }
      if (!draggingInfo.origin) { return; }

      const cx = event.clientX;
      const cy = event.clientY;
      const rx = cx - draggingInfo.origin.x;
      const ry = cy - draggingInfo.origin.y;

      switch (draggingInfo.target) {
        case "node": {
          const n = graph.shapeMap[draggingInfo.nodeId];
          if (!n) { return; }
          if (!isGraphNode(n)) { return; }
          const xTo = rx / scale;
          const yTo = ry / scale;
          const positionTo = { x: xTo, y: yTo };
          updateNode(n.id, { position: positionTo });
          break;
        }
        case "reshaper": {
          const n = graph.shapeMap[draggingInfo.nodeId];
          if (!n) { return; }
          if (isGraphNode(n)) {
            reshapeRectangleLikeNode({
              shape: n, rx, ry, scale, draggingInfo, updateNode, modifierKey
            });
          } else if (isGraphSegment(n)) {
            reshapeSegment({
              shape: n, rx, ry, scale, draggingInfo, updateSegment, modifierKey, graph,
            });
          }
          break;
        }
        case "field": {
          const dx = cx - draggingInfo.origin.x;
          const dy = cy - draggingInfo.origin.y;
          moveOrigin(dx, dy);
          break;
        }
      }
    };
    const handleMouseUp = () => {
      switch (draggingInfo.target) {
        case "node": {
          setDraggingInfo({
            target: null,
          });
          break;
        }
        case "reshaper": {
          setDraggingInfo({
            target: null,
          });
          break;
        }
      }

    };
    const handleMouseDown = (event: MouseEvent) => {
      if (draggingInfo.target !== "field") { return; }
      // フィールド自体のドラッグを行う
      const cx = event.clientX;
      const cy = event.clientY;
      const x = cx - display.origin.x;
      const y = cy - display.origin.y;
      setDraggingInfo({
        target: "field",
        origin: { x, y },
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  });

  useOnPinch({
    onPinchZoom: (e) => {
      if (!svgRef.current) { return; }
      const center: Vector = { x: e.clientX, y: e.clientY };
      const deltaMag = e.deltaY > 0 ? -0.009 : 0.008;
      changeScale(display.magnitude + deltaMag, center);
    },
    onPinchScroll: (e) => {
      if (!svgRef.current) { return; }
      const dx = e.deltaX;
      const dy = e.deltaY;
      moveOrigin(display.origin.x - dx, display.origin.y - dy);
    },
  });

  const GridElement = <GridOverlay getViewRect={() => {
    if (svgRef.current) {
      const rect = svgRef.current.getClientRects()[0];
      return {
        r0: { x: rect.left, y: rect.top },
        r1: { x: rect.left + rect.width, y: rect.top + rect.height },
      }
    } else {
      return {
        r0: { x: 0, y: 0 },
        r1: { x: 10000, y: 10000 },
      }
    }
  }} />

  return <div className="h-screen w-screen flex flex-col" style={style}>
    <div className="h-full w-full">
      <svg
        className="h-full w-full"
        ref={svgRef}
        onClick={() => {
          setSelectedNodes({ ids: [], set: {} });
        }}
      >

        {GridElement}

        <g
          style={{
            transform: transformFieldToBrowser,
          }}
        >
          <NodeGroup
            selectedNodes={selectedNodes}
            graph={graph}
            click={(_, node) => {
              if (!selectedNodes.set[node.id]) {
                setSelectedNodes(() => {
                  return {
                    ids: [node.id],
                    set: { [node.id]: true },
                  }
                });
              }
            }}

            mouseDown={(e, draggableMatter) => {
              if (draggingInfo.target === "node") { return; }
              if (draggableMatter.target !== "node") { return; }
              const node = graph.shapeMap[draggableMatter.nodeId];
              if (!isGraphNode(node)) { return; }
              setDraggingInfo({
                ...draggableMatter,
                origin: { x: e.clientX - node.position.x * scale, y: e.clientY - node.position.y * scale, },
                size: node.size,
              });
            }}
          />
        </g>
        <SelectedLayer
          selectedNodes={selectedNodes}
          mouseDown={(e, draggableMatter) => {
            if (draggableMatter.target !== "reshaper") { return; }
            const node = graph.shapeMap[draggableMatter.nodeId];
            if (isGraphNode(node)) {
              const x = node.position.x;
              const y = node.position.y;
              const w = node.size.width;
              const h = node.size.height;
              switch (draggableMatter.resizerType) {
                case "N": {
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - (x + w / 2) * scale, y: e.clientY - y * scale, },
                  });
                  break;
                }
                case "E": {
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - (x + w) * scale, y: e.clientY - (y + h / 2) * scale, },
                  });
                  break;
                }
                case "S": {
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - (x + w / 2) * scale, y: e.clientY - (y + h) * scale, },
                  });
                  break;
                }
                case "W": {
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - x * scale, y: e.clientY - (y + h / 2) * scale, },
                  });
                  break;
                }
                case "NW": {
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - x * scale, y: e.clientY - y * scale, },
                  });
                  break;
                }
                case "NE": {
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - (x + w) * scale, y: e.clientY - y * scale, },
                  });
                  break;
                }
                case "SW": {
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - x * scale, y: e.clientY - (y + h) * scale, },
                  });
                  break;
                }
                case "SE": {
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - (x + w) * scale, y: e.clientY - (y + h) * scale, },
                  });
                  break;
                }
              }
            } else if (isGraphSegment(node)) {
              switch (draggableMatter.resizerType) {
                case "Start": {
                  const r = positionForBond(node.starting, graph);
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - r.x * scale, y: e.clientY - r.y * scale, },
                  });
                  break;
                }
                case "End": {
                  const r = positionForBond(node.ending, graph);
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - r.x * scale, y: e.clientY - r.y * scale, },
                  });
                  break;
                }
              }
            }
          }}
        />
      </svg>
    </div>



    <BasicPalette getCenter={() => {
      if (!svgRef.current) { return { x: 0, y: 0 }; }
      const svgRect = svgRef.current.getClientRects()[0];
      const center: Vector = { x: svgRect.width / 2, y: svgRect.height / 2 };
      return center;
    }} />

    {Object.keys(selectedNodes.ids).length === 1 && <div className="absolute right-0 top-0 p-4"
      onMouseDown={(e) => { e.stopPropagation(); }}
    >
      <NodeEditView
        selectedNodes={selectedNodes}
      />
    </div>}


    <div className="absolute left-0 bottom-0 p-4"
      onMouseDown={(e) => { e.stopPropagation(); }}
    >
      <SystemView
        selectedNodes={selectedNodes}
        draggingInfo={draggingInfo}
      />
    </div>
  </div>;
};
