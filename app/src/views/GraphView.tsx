import { useCallback, useEffect, useRef, useState } from "react";
import { useGraph } from "../stores/graph";
import { useDisplay } from "../stores/display";
import { CausalGraph, GraphNode, Vector } from "../types";
import { SvgNodeShape } from "../components/graph/SvgNodeShape";


type DraggingTarget = "node" | "field" | null;

const SystemView = (props: {
  graph: CausalGraph;
  draggingNode: GraphNode | null;
  draggingOrigin: Vector | null;
  draggingTarget: DraggingTarget;
}) => {
  return <div className="p-4 gap-4 flex flex-row border-2 border-green-500 text-xs">
    <p>
      nodes: {props.graph.nodes.length}
    </p>
    <p>
      draggingNode: {props.draggingNode?.id || "none"}
    </p>
    <p>
      draggingTarget: {props.draggingTarget || "none"}
    </p>
  </div>

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
  } = useDisplay();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingTarget, setDraggingTarget] = useState<DraggingTarget>(null);
  const [draggingNode, setDraggingNode] = useState<GraphNode | null>(null);
  const [draggingOrigin, setDraggingOrigin] = useState<Vector | null>(null);

  const fieldTranslation = `translate(${display.origin.x}px, ${display.origin.y}px)`;

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
          const xTo = event.clientX - draggingOrigin.x
          const yTo = event.clientY - draggingOrigin.y
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
                  x: e.clientX - node.position.x, y: e.clientY - node.position.y,
                });
              }}
            />)
          }
        </g>
      </svg>
    </div>

    <div className="absolute right-0 p-4">
      <div className="p-4 border-2 border-green-500">
        <button
          onClick={() => {
            newNode({ x: -display.origin.x, y: -display.origin.y });
          }}
        >Add Node</button>
      </div>
    </div>

    <div className="absolute left-0 bottom-0 p-4">
      <SystemView
        graph={graph}
        draggingNode={draggingNode}
        draggingOrigin={draggingOrigin}
        draggingTarget={draggingTarget}
      />
    </div>
  </div>;
};