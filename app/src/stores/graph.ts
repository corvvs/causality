import { atom, useAtom } from "jotai";
import { CausalGraph, GraphNode, RectangleNode, Vector } from "../types";
import { localStorageProvider } from "../infra/localStorage";
import { nanoid } from "nanoid";

const graphKey = "GRAPH";
const graphProvider = localStorageProvider<CausalGraph>();

const graphAtom = atom<CausalGraph>(graphProvider.load(graphKey) ?? {
  index: 0,
  nodes: [],
  edges: [],
});

const createDefaultNode = (index: number, position: Vector): RectangleNode => {
  return {
    id: nanoid(),
    position,
    z: index,
    label: "",
    nodeType: "Rectangle",
    shape: {
      width: 100,
      height: 100,
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
  const newNode = (position: Vector) => {
    const newIndex = graph.index + 1;
    const newNode = createDefaultNode(newIndex, position);
    setGraph((prev) => {
      return {
        index: newIndex,
        nodes: [...prev.nodes, newNode],
        edges: prev.edges,
      };
    });
    return newNode;
  };

  const updateNode = (nodeId: string, node: Partial<GraphNode>) => {
    const i = graph.nodes.findIndex((n) => n.id === nodeId);
    if (i < 0) {
      return;
    }
    setGraph((prev) => {
      const nodes = prev.nodes.map(n => n);
      nodes[i] = { ...nodes[i], ...node };
      return {
        ...prev,
        nodes,
      };
    });
  };

  const deleteNode = (nodeId: string) => {
    const nodeIndexToDelete = graph.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndexToDelete < 0) {
      return;
    }
    setGraph((prev) => {
      return {
        ...prev,
        nodes: prev.nodes.filter((n) => n.id !== nodeId),
        edges: prev.edges.filter((e) => e.startNodeId !== nodeId && e.endNodeId !== nodeId),
      };
    });
  };

  return {
    graph,
    newNode,
    updateNode,
    deleteNode,
  };
};

