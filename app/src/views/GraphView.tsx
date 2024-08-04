import { useCallback, useEffect, useRef, useState } from "react";
import { useGraph } from "../stores/graph";
import { useDisplay } from "../stores/display";
import { GraphNode, Vector } from "../types";
import { SvgNodeShape } from "../components/graph/SvgNodeShape";




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
  const [draggingNode, setDraggingNode] = useState<GraphNode | null>(null);
  const [draggingOrigin, setDraggingOrigin] = useState<Vector | null>(null);


  const cursor = draggingNode ? { cursor: "grab" } : {};
  const style = {
    ...cursor,
  };

  useEffect(() => {

    const handleMouseMove = (event: any) => {
      if (!draggingNode) { return; }
      if (!draggingOrigin) { return; }
      const n = graph.nodes.find(node => node.id === draggingNode.id);
      if (!n) { return; }
      const xTo = event.clientX - draggingOrigin.x
      const yTo = event.clientY - draggingOrigin.y
      const positionTo = { x: xTo, y: yTo };
      updateNode(n.id, { position: positionTo });
    };
    const handleMouseUp = () => {
      setDraggingNode(null);
      setDraggingOrigin(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return <div className="h-screen w-screen flex flex-col" style={style}>
    <div className="h-full w-full">
      <svg className="svg-master h-full w-full border-2 border-red-600" ref={svgRef}>
        {
          graph.nodes.map(node => <SvgNodeShape
            key={node.id} node={node}
            mouseDown={(e, node) => {
              if (draggingNode) { return; }
              setDraggingNode(node);
              setDraggingOrigin({
                x: e.clientX - node.position.x, y: e.clientY - node.position.y,
              });
            }}
          />)
        }
      </svg>
    </div>

    <div className="absolute right-0 p-4">
      <div className="p-4 border-2 border-green-500">
        <button
          onClick={() => {
            newNode(display.origin);
          }}
        >Add Node</button>
      </div>
    </div>

    <div className="absolute right-0 bottom-0 p-4">
      <div className="p-4 flex flex-row border-2 border-green-500">
        <p>
          nodes: {graph.nodes.length}
        </p>
      </div>
    </div>
  </div>
};