import { useEffect, useRef, useState } from "react";
import { useGraph } from "../stores/graph";
import { useDisplay } from "../stores/display";
import { Vector } from "../types";
import { useOnPinch, useRerenderOnResize } from "../hooks/events";
import { NodeGroup, ScaleView, SystemView } from "./GraphView/components";
import { GridOverlay } from "./GraphView/GridOverlay";
import { DraggingInfo, NodeSelection } from "./GraphView/types";
import { SelectedLayer } from "./GraphView/SelectedLayer";

export const GraphView = () => {
  const {
    newNode,
    updateNode,
    graph,
  } = useGraph();
  const {
    display,
    scale,
    moveOrigin,
    changeScale,
    transformFieldToBrowser,
  } = useDisplay();

  const svgRef = useRef<SVGSVGElement | null>(null);
  useRerenderOnResize(svgRef);


  const [selectedNodes, setSelectedNodes] = useState<NodeSelection>({});
  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo>({
    target: null,
  });

  const cursor = draggingInfo.target === "node" ? { cursor: "grab" } : {};
  const style = {
    ...cursor,
  };

  useEffect(() => {

    const handleMouseMove = (event: any) => {
      if (!draggingInfo.target) { return; }
      if (!draggingInfo.origin) { return; }

      switch (draggingInfo.target) {
        case "node": {
          const n = graph.nodes[draggingInfo.nodeId];
          if (!n) { return; }
          const xTo = (event.clientX - draggingInfo.origin.x) / scale;
          const yTo = (event.clientY - draggingInfo.origin.y) / scale;
          const positionTo = { x: xTo, y: yTo };
          updateNode(n.id, { position: positionTo });
          break;
        }
        case "nodeResizer": {
          const n = graph.nodes[draggingInfo.nodeId];
          if (!n) { return; }
          const xTo = (event.clientX - draggingInfo.origin.x) / scale;
          const yTo = (event.clientY - draggingInfo.origin.y) / scale;
          switch (draggingInfo.resizerType) {
            case "N": {
              const yFrom = n.position.y + n.size.height;
              const h = yFrom - yTo
              if (h <= 0) { return; }
              updateNode(n.id, {
                position: { x: n.position.x, y: yTo },
                size: { width: n.size.width, height: h }
              });
              break;
            }
            case "E": {
              const w = xTo - n.position.x;
              if (w <= 0) { return; }
              updateNode(n.id, {
                size: { width: w, height: n.size.height }
              });
              break;
            }
            case "S": {
              const h = yTo - n.position.y;
              if (h <= 0) { return; }
              updateNode(n.id, {
                size: { width: n.size.width, height: h }
              });
              break;
            }
            case "W": {
              const xFrom = n.position.x + n.size.width;
              const w = xFrom - xTo
              if (w <= 0) { return; }
              updateNode(n.id, {
                position: { x: xTo, y: n.position.y },
                size: { width: w, height: n.size.height }
              });
              break;
            }
            case "NW": {
              const xFrom = n.position.x + n.size.width;
              const yFrom = n.position.y + n.size.height;
              const w = xFrom - xTo;
              const h = yFrom - yTo
              if (w <= 0 || h <= 0) { return; }
              updateNode(n.id, {
                position: { x: xTo, y: yTo },
                size: { width: w, height: h }
              });
              break;
            }
            case "NE": {
              const w = xTo - n.position.x;
              const h = n.size.height - (yTo - n.position.y);
              if (w <= 0 || h <= 0) { return; }
              updateNode(n.id, {
                position: { x: n.position.x, y: yTo },
                size: { width: w, height: h }
              });
              break;
            }
            case "SW": {
              const w = n.size.width - (xTo - n.position.x);
              const h = yTo - n.position.y;
              if (w <= 0 || h <= 0) { return; }
              updateNode(n.id, {
                position: { x: xTo, y: n.position.y },
                size: { width: w, height: h }
              });
              break;
            }
            case "SE": {
              const w = xTo - n.position.x;
              const h = yTo - n.position.y;
              if (w <= 0 || h <= 0) { return; }
              updateNode(n.id, { size: { width: w, height: h } });
              break;
            }
          }
          break;
        }
        case "field": {
          const dx = event.clientX - draggingInfo.origin.x;
          const dy = event.clientY - draggingInfo.origin.y;
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
        case "nodeResizer": {
          setDraggingInfo({
            target: null,
          });
          break;
        }
      }

    };
    const handleMouseDown = (event: any) => {
      if (draggingInfo.target !== "field") { return; }
      // フィールド自体のドラッグを行う
      const x = event.clientX - display.origin.x;
      const y = event.clientY - display.origin.y;
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
      const deltaMag = e.deltaY > 0 ? -0.02 : 0.018;
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
        className="svg-master h-full w-full border-2 border-red-600"
        ref={svgRef}
        onClick={(e) => {
          console.log("SVG ONCLICK");
          setSelectedNodes({});
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
            click={(e, node) => {
              setSelectedNodes({ [node.id]: node });
            }}

            mouseDown={(e, draggableMatter) => {
              if (draggingInfo.target === "node") { return; }
              if (draggableMatter.target !== "node") { return; }
              const node = graph.nodes[draggableMatter.nodeId];
              setDraggingInfo({
                ...draggableMatter,
                origin: { x: e.clientX - node.position.x * scale, y: e.clientY - node.position.y * scale, },
              });
            }}
          />
        </g>
        <SelectedLayer
          selectedNodes={selectedNodes}
          mouseDown={(e, draggableMatter) => {
            if (draggableMatter.target !== "nodeResizer") { return; }
            const node = graph.nodes[draggableMatter.nodeId];
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
          }}
        />
      </svg>
    </div>

    <div className="absolute flex flex-row gap-4 right-0 p-4"
      onMouseDown={(e) => { e.stopPropagation(); }}
    >

      <ScaleView getCenter={() => {
        if (!svgRef.current) { return null; }
        const svgRect = svgRef.current.getClientRects()[0];
        const center: Vector = { x: svgRect.width / 2, y: svgRect.height / 2 };
        return center;
      }} />

      <div className="border-2 border-green-500">
        <button
          onClick={() => {
            newNode({ x: -display.origin.x / scale, y: -display.origin.y / scale });
          }}
        >Add Node</button>
      </div>
    </div>

    <div className="absolute left-0 bottom-0 p-4"
      onMouseDown={(e) => { e.stopPropagation(); }}
    >
      <SystemView
        graph={graph}
        display={display}
        selectedNodes={selectedNodes}
        draggingInfo={draggingInfo}
      />
    </div>
  </div>;
};
