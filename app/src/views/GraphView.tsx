import { useEffect, useRef, useState } from "react";
import { useGraph } from "../stores/graph";
import { useDisplay } from "../stores/display";
import { GraphNode, Vector } from "../types";
import { useOnPinch, useRerenderOnResize } from "../hooks/events";
import { NodeGroup, ScaleView, SystemView } from "./GraphView/components";
import { GridOverlay } from "./GraphView/GridOverlay";
import { DraggingTarget } from "./GraphView/types";


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
  } = useDisplay();

  const svgRef = useRef<SVGSVGElement | null>(null);
  useRerenderOnResize(svgRef);
  const [draggingTarget, setDraggingTarget] = useState<DraggingTarget>(null);
  const [draggingNode, setDraggingNode] = useState<GraphNode | null>(null);
  const [draggingOrigin, setDraggingOrigin] = useState<Vector | null>(null);

  const cursor = draggingNode ? { cursor: "grab" } : {};
  const style = {
    ...cursor,
  };

  useEffect(() => {

    const handleMouseMove = (event: any) => {
      if (!draggingTarget) { return; }
      if (!draggingOrigin) { return; }

      switch (draggingTarget) {
        case "node": {
          if (!draggingNode) { return; }
          const n = graph.nodes.find(node => node.id === draggingNode.id);
          if (!n) { return; }
          const xTo = (event.clientX - draggingOrigin.x) / scale;
          const yTo = (event.clientY - draggingOrigin.y) / scale;
          const positionTo = { x: xTo, y: yTo };
          updateNode(n.id, { position: positionTo });
          break;
        }
        case "field": {
          const dx = event.clientX - draggingOrigin.x;
          const dy = event.clientY - draggingOrigin.y;
          moveOrigin(dx, dy);
          break;
        }
      }
    };
    const handleMouseUp = () => {
      setDraggingTarget(null);
      setDraggingNode(null);
      setDraggingOrigin(null);
    };
    const handleMouseDown = (event: any) => {
      if (draggingNode) { return; }
      // フィールド自体のドラッグを行う
      const x = event.clientX - display.origin.x;
      const y = event.clientY - display.origin.y;
      setDraggingTarget("field");
      setDraggingOrigin({ x, y });
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
      >

        {GridElement}

        <NodeGroup
          mouseDown={(e, node) => {
            if (draggingNode) { return; }
            setDraggingTarget("node");
            setDraggingNode(node);
            setDraggingOrigin({
              x: e.clientX - node.position.x * scale, y: e.clientY - node.position.y * scale,
            });
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
        draggingNode={draggingNode}
        draggingOrigin={draggingOrigin}
        draggingTarget={draggingTarget}
      />
    </div>
  </div>;
};
