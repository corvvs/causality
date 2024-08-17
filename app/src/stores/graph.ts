import { atom, useAtom } from "jotai";
import { CausalGraph, CircleNode, GraphEdge, GraphNode, NodeEdgeMap, RectangleNode, Vector } from "../types";
import { localStorageProvider } from "../infra/localStorage";

const graphKey = "GRAPH";
const graphProvider = localStorageProvider<CausalGraph>();

const graphAtom = atom<CausalGraph>(graphProvider.load(graphKey) ?? {
  index: 0,
  shapeMap: {},
  orders: [],
  forwardEdgeMap: {},
  backwardEdgeMap: {},
});

const newRectNode = (index: number, position: Vector): RectangleNode => {
  return {
    id: index,
    position,
    z: index,
    label: "",
    shapeType: "Rectangle",
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
    shapeType: "Circle",
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
        shapeMap: {
          ...prev.shapeMap,
          [nn.id]: nn,
        },
        orders: [...prev.orders, nn.id],
        forwardEdgeMap: prev.forwardEdgeMap,
        backwardEdgeMap: prev.backwardEdgeMap,
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
        shapeMap: {
          ...prev.shapeMap,
          [nn.id]: nn,
        },
        orders: [...prev.orders, nn.id],
        forwardEdgeMap: prev.forwardEdgeMap,
        backwardEdgeMap: prev.backwardEdgeMap,
      };
    });
    return nn;
  };

  /**
   * 2つのノードを結ぶエッジを作成する
   * @param startNodeId 
   * @param endNodeId 
   */
  const linkUpNodes = (startNodeId: number, endNodeId: number) => {
    if (startNodeId === endNodeId) {
      console.warn("Cannot link a node to itself");
      return;
    }
    const newIndex = graph.index + 1;
    const edge: GraphEdge = {
      id: newIndex,
      shapeType: "Edge",
      label: "",
      startNodeId,
      endNodeId,
      z: newIndex,
    };
    setGraph((prev) => {
      const idPairFT = `${edge.startNodeId}-${edge.endNodeId}`;
      const idPairTF = `${edge.endNodeId}-${edge.startNodeId}`;
      const forwardEdgeMap: NodeEdgeMap = { ...prev.forwardEdgeMap, [idPairFT]: prev.forwardEdgeMap[idPairFT] || [] };
      const backwardEdgeMap: NodeEdgeMap = { ...prev.backwardEdgeMap, [idPairTF]: prev.backwardEdgeMap[idPairTF] || [] };
      forwardEdgeMap[idPairFT].push(edge.id);
      backwardEdgeMap[idPairTF].push(edge.id);

      return {
        index: newIndex,
        shapeMap: { ...prev.shapeMap, [edge.id]: edge },
        orders: [...prev.orders, edge.id],
        forwardEdgeMap,
        backwardEdgeMap,
      };
    });
  };


  const updateNode = (nodeId: number, node: Partial<GraphNode>) => {
    const n = graph.shapeMap[nodeId];
    if (!n) { return; }
    const newNode = { ...n, ...node };
    setGraph((prev) => {
      return {
        ...prev,
        shapeMap: {
          ...prev.shapeMap,
          [nodeId]: newNode,
        },
      };
    });
  };

  return {
    graph,
    addRectNode,
    addCircleNode,
    updateNode,
    linkUpNodes,
  };
};

