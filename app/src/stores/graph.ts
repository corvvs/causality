import { atom, useAtom } from "jotai";
import { CausalGraph, CircleNode, GraphNode, RectangleNode, Vector } from "../types";
import { localStorageProvider } from "../infra/localStorage";

const graphKey = "GRAPH";
const graphProvider = localStorageProvider<CausalGraph>();

const graphAtom = atom<CausalGraph>(graphProvider.load(graphKey) ?? {
  index: 0,
  nodes: {},
  nodeOrder: [],
  edges: [],
});

const newRectNode = (index: number, position: Vector): RectangleNode => {
  return {
    id: index,
    position,
    z: index,
    label: "",
    nodeType: "Rectangle",
    size: {
      width: 100,
      height: 100,
    },
    shape: {
      line: {
        lineWidth: 2,
      },
    },
  }
};

const newCircleNode = (index: number, position: Vector): CircleNode => {
  return {
    id: index,
    position,
    z: index,
    label: "",
    nodeType: "Circle",
    size: {
      width: 100,
      height: 100,
    },
    shape: {
      line: {
        lineWidth: 2,
      },
    },
  }
};

export const useGraph = () => {
  const [graph, setGraph] = useAtom(graphAtom);

  /**
   * 新しいノードを作成してグラフに追加する.
   * 作成したノードを返す.
   * @returns 
   */
  const addRectNode = (position: Vector) => {
    const newIndex = graph.index + 1;
    const nn = newRectNode(newIndex, position);
    setGraph((prev) => {
      return {
        index: newIndex,
        nodes: {
          ...prev.nodes,
          [nn.id]: nn,
        },
        nodeOrder: [...prev.nodeOrder, nn.id],
        edges: prev.edges,
      };
    });
    return nn;
  };

  const addCircleNode = (position: Vector) => {
    const newIndex = graph.index + 1;
    const nn = newCircleNode(newIndex, position);
    setGraph((prev) => {
      return {
        index: newIndex,
        nodes: {
          ...prev.nodes,
          [nn.id]: nn,
        },
        nodeOrder: [...prev.nodeOrder, nn.id],
        edges: prev.edges,
      };
    });
    return nn;
  };


  const updateNode = (nodeId: number, node: Partial<GraphNode>) => {
    const n = graph.nodes[nodeId];
    if (!n) { return; }
    setGraph((prev) => {
      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [nodeId]: { ...n, ...node },
        },
      };
    });
  };

  const deleteNode = (nodeId: number) => {
    const nodeIndexToDelete = graph.nodeOrder.findIndex((n) => n === nodeId);
    if (nodeIndexToDelete < 0) {
      return;
    }
    const newNodes = { ...graph.nodes };
    delete newNodes[nodeId];
    setGraph((prev) => {
      return {
        ...prev,
        nodes: newNodes,
        nodeOrder: prev.nodeOrder.filter((n) => n !== nodeId),
        edges: prev.edges.filter((e) => e.startNodeId !== nodeId && e.endNodeId !== nodeId),
      };
    });
  };

  return {
    graph,
    addRectNode,
    addCircleNode,
    updateNode,
    deleteNode,
  };
};

