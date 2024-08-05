import { useEffect, useRef, useState } from "react";
import { useGraph } from "../stores/graph";
import { useDisplay } from "../stores/display";
import { CausalDisplay, CausalGraph, GraphNode, Vector } from "../types";
import { sprintf } from "sprintf-js";
import { useOnPinch } from "../hooks/events";
import { ComponentWithProps } from "../types/components";
import { NodeGroup, QuadrandCross } from "./GraphView/components";


type DraggingTarget = "node" | "field" | null;

const SystemView = (props: {
  graph: CausalGraph;
  display: CausalDisplay;
  draggingNode: GraphNode | null;
  draggingOrigin: Vector | null;
  draggingTarget: DraggingTarget;
}) => {
  const scale = Math.pow(10, props.display.magnitude);
  return <div className="p-4 gap-4 flex flex-col border-2 border-green-500 text-xs text-left">
    <p>
      nodes: {props.graph.nodes.length}
    </p>
    <p>
      display.origin: {`(${props.display.origin.x}, ${props.display.origin.y})`}
    </p>
    <p>
      display.scale: {sprintf("%1.2f", scale)}
    </p>
    <p>
      draggingNode: {props.draggingNode?.id || "none"}
    </p>
    <p>
      draggingTarget: {props.draggingTarget || "none"}
    </p>
  </div>
};

const ScaleView: ComponentWithProps<{ getCenter: () => Vector | null }> = ({
  getCenter
}) => {
  const {
    display,
    scale,
    changeScale,
    scaleMin,
    scaleMax,
  } = useDisplay();

  return <div className="border-2 border-green-500">
    <input type="range" min={scaleMin} max={scaleMax} step="0.001" value={display.magnitude} onChange={(e) => {
      const center = getCenter();
      if (!center) { return; }
      changeScale(parseFloat(e.target.value), center);
      e.stopPropagation();
    }} />
    <p>{Math.floor(scale * 100 + 0.5)}%</p>
  </div>

};

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
    onPinch: (e) => {
      if (!svgRef.current) { return; }
      setTimeout(() => {
        const center: Vector = { x: e.clientX, y: e.clientY };
        const deltaMag = e.deltaY > 0 ? -0.02 : 0.018;
        changeScale(display.magnitude + deltaMag, center);
      }, 0);
    }
  });

  return <div className="h-screen w-screen flex flex-col" style={style}>
    <div className="h-full w-full">
      <svg
        className="svg-master h-full w-full border-2 border-red-600"
        ref={svgRef}
      >

        <QuadrandCross />

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