import { useEffect, useRef, useState } from "react";
import { useGraph } from "../stores/graph";
import { useDisplay } from "../stores/display";
import { CausalDisplay, CausalGraph, GraphNode, Vector } from "../types";
import { SvgNodeShape } from "../components/graph/SvgNodeShape";
import { sprintf } from "sprintf-js";


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

const QuadrandCross = () => {
  const {
    display,
  } = useDisplay(); const quadrantTranslation = `translate(${display.origin.x}px, ${display.origin.y}px)`;
  return <g
    style={{
      transform: quadrantTranslation,
    }}
  >
    <line
      x1={-100000} y1={0} x2={100000} y2={0}
      stroke="white"
    />
    <line
      x1={0} y1={-100000} x2={0} y2={100000}
      stroke="white"
    />
  </g>

};


export const GraphView = () => {
  const {
    newNode,
    updateNode,
    deleteNode,
    graph,
  } = useGraph();
  const {
    display,
    moveOrigin,
    changeScale,
    scaleMin,
    scaleMax,
  } = useDisplay();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingTarget, setDraggingTarget] = useState<DraggingTarget>(null);
  const [draggingNode, setDraggingNode] = useState<GraphNode | null>(null);
  const [draggingOrigin, setDraggingOrigin] = useState<Vector | null>(null);

  const scale = Math.pow(10, display.magnitude);
  const fieldTranslation = `translate(${display.origin.x}px, ${display.origin.y}px) scale(${scale})`;

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
          console.log("dx, dy:", dx, dy);
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

  console.log("fieldTranslation:", fieldTranslation);

  return <div className="h-screen w-screen flex flex-col" style={style}>
    <div className="h-full w-full">
      <svg
        className="svg-master h-full w-full border-2 border-red-600"
        ref={svgRef}
      >

        <QuadrandCross />
        <g
          style={{
            transform: fieldTranslation,
          }}
        >
          {
            graph.nodes.map(node => <SvgNodeShape
              key={node.id} node={node}
              mouseDown={(e, node) => {
                if (draggingNode) { return; }
                setDraggingTarget("node");
                setDraggingNode(node);
                setDraggingOrigin({
                  x: e.clientX - node.position.x * scale, y: e.clientY - node.position.y * scale,
                });
              }}
            />)
          }
        </g>
      </svg>
    </div>

    <div className="absolute flex flex-row gap-4 right-0 p-4"
      onMouseDown={(e) => { e.stopPropagation(); }}
    >
      <div className="border-2 border-green-500">
        <input type="range" min={scaleMin} max={scaleMax} step="0.001" value={display.magnitude} onChange={(e) => {
          if (!svgRef.current) { return; }
          const svgRect = svgRef.current.getClientRects()[0];
          console.log("svgRect:", svgRect.width, svgRect.height);
          const center: Vector = { x: svgRect.width / 2, y: svgRect.height / 2 };
          console.log(center);
          changeScale(parseFloat(e.target.value), center);
          e.stopPropagation();
        }} />
        <p>{Math.floor(Math.pow(10, display.magnitude) * 100 + 0.5)}%</p>
      </div>
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