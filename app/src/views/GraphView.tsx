import { useEffect, useRef, useState } from "react";
import { useGraph } from "../stores/graph";
import { useDisplay } from "../stores/display";
import { isGraphNode, isGraphSegment, Vector } from "../types";
import { useOnPinch, useRerenderOnResize } from "../hooks/events";
import { NodeGroup } from "./GraphView/components";
import { GridOverlay } from "./GraphView/GridOverlay";
import { DraggingInfo, NodeSelection } from "./GraphView/types";
import { SelectedLayer } from "./GraphView/SelectedLayer";
import { NodeEditView } from "./GraphView/NodeEditView";
import { SystemView } from "./GraphView/SystemView";
import { useModifierKey } from "../stores/modifier_keys";
import { BasicPalette } from "../components/palette/BasicPalette";
import { getPositionForTerminus, isFullyFree } from "../libs/segment";
import { reshapeRectangleLikeNode, reshapeSegment } from "./GraphView/reshaping";



export const GraphView = () => {
  const {
    updateNode,
    updateSegment,
    getShape,
    getActualShape,
    startEdit,
    commitEdit,
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
    const handleMouseMove = (event: MouseEvent) => {
      if (!draggingInfo.target) { return; }
      if (!draggingInfo.origin) { return; }

      const cx = event.clientX;
      const cy = event.clientY;
      const rx = cx - draggingInfo.origin.x;
      const ry = cy - draggingInfo.origin.y;

      switch (draggingInfo.target) {
        case "node": {
          const n = getShape(draggingInfo.shapeId);
          if (!n) { return; }
          if (!isGraphNode(n)) { return; }
          const xTo = rx / scale;
          const yTo = ry / scale;
          const positionTo = { x: xTo, y: yTo };
          updateNode(n.id, { position: positionTo });
          break;
        }
        case "segment": {
          const n = getShape(draggingInfo.shapeId);
          if (!n) { return; }
          if (!isGraphSegment(n)) { return; }
          if (!isFullyFree(n)) { return; }
          const xTo = rx / scale;
          const yTo = ry / scale;
          const r = getPositionForTerminus(n, graph);
          const rs = r.starting;
          const re = r.ending;
          const dx = xTo - rs.x;
          const dy = yTo - rs.y;
          updateSegment(n.id, {
            starting: { x: rs.x + dx, y: rs.y + dy },
            ending: { x: re.x + dx, y: re.y + dy },
          });
          break;
        }
        case "reshaper": {
          const n = getShape(draggingInfo.shapeId);
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

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [draggingInfo, scale, updateNode, updateSegment, getShape, graph, moveOrigin, modifierKey]);

  useEffect(() => {
    const handleMouseUp = () => {
      switch (draggingInfo.target) {
        case "node": {
          commitEdit(draggingInfo.shapeId);
          setDraggingInfo({
            target: null,
          });
          break;
        }
        case "segment": {
          commitEdit(draggingInfo.shapeId);
          setDraggingInfo({
            target: null,
          });
          break;
        }
        case "reshaper": {
          commitEdit(draggingInfo.shapeId);
          setDraggingInfo({
            target: null,
          });
          break;
        }
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingInfo, commitEdit]);

  useEffect(() => {
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
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    }
  }, [display.origin, draggingInfo.target]);

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
              switch (draggableMatter.target) {
                case "node": {
                  if (draggingInfo.target === "node") { return; }
                  const node = getActualShape(draggableMatter.shapeId);
                  if (!isGraphNode(node)) { return; }
                  startEdit(draggableMatter.shapeId);
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - node.position.x * scale, y: e.clientY - node.position.y * scale, },
                    size: node.size,
                  });
                  break;
                }
                case "segment": {
                  if (draggingInfo.target === "segment") { return; }
                  const segment = getActualShape(draggableMatter.shapeId);
                  if (!isGraphSegment(segment)) { return; }
                  if (!isFullyFree(segment)) { return; }
                  const s = getPositionForTerminus(segment, graph).starting;
                  startEdit(draggableMatter.shapeId);
                  setDraggingInfo({
                    ...draggableMatter,
                    origin: { x: e.clientX - s.x * scale, y: e.clientY - s.y * scale, },
                  });
                  break;
                }
              }
            }}
          />
        </g>
        <SelectedLayer
          selectedNodes={selectedNodes}
          mouseDown={(e, draggableMatter) => {
            if (draggableMatter.target !== "reshaper") { return; }
            const node = getShape(draggableMatter.shapeId);
            if (isGraphNode(node)) {
              const x = node.position.x;
              const y = node.position.y;
              const w = node.size.width;
              const h = node.size.height;
              let origin: Vector = { x: 0, y: 0 };
              switch (draggableMatter.resizerType) {
                case "N": {
                  origin = { x: e.clientX - (x + w / 2) * scale, y: e.clientY - y * scale, };
                  break;
                }
                case "E": {
                  origin = { x: e.clientX - (x + w) * scale, y: e.clientY - (y + h / 2) * scale, };
                  break;
                }
                case "S": {
                  origin = { x: e.clientX - (x + w / 2) * scale, y: e.clientY - (y + h) * scale, };
                  break;
                }
                case "W": {
                  origin = { x: e.clientX - x * scale, y: e.clientY - (y + h / 2) * scale, };
                  break;
                }
                case "NW": {
                  origin = { x: e.clientX - x * scale, y: e.clientY - y * scale, };
                  break;
                }
                case "NE": {
                  origin = { x: e.clientX - (x + w) * scale, y: e.clientY - y * scale, };
                  break;
                }
                case "SW": {
                  origin = { x: e.clientX - x * scale, y: e.clientY - (y + h) * scale, };
                  break;
                }
                case "SE": {
                  origin = { x: e.clientX - (x + w) * scale, y: e.clientY - (y + h) * scale, };
                  break;
                }
              }
              startEdit(draggableMatter.shapeId);
              setDraggingInfo({
                ...draggableMatter,
                origin,
              });
            } else if (isGraphSegment(node)) {
              let origin: Vector = { x: 0, y: 0 };
              const rr = getPositionForTerminus(node, graph);
              switch (draggableMatter.resizerType) {
                case "Start": {
                  const r = rr.starting;
                  origin = { x: e.clientX - r.x * scale, y: e.clientY - r.y * scale, };
                  break;
                }
                case "End": {
                  const r = rr.ending;
                  origin = { x: e.clientX - r.x * scale, y: e.clientY - r.y * scale, };
                  break;
                }
              }
              startEdit(draggableMatter.shapeId);
              setDraggingInfo({
                ...draggableMatter,
                origin,
              });
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
