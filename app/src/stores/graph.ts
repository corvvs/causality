import { atom, useAtom } from "jotai";
import { CausalGraph, CircleNode, GraphSegment, GraphNode, NodeSegmentMap, RectangleNode, Vector } from "../types";
import { localStorageProvider } from "../infra/localStorage";
import { vectorAdd } from "../libs/vector";

const graphKey = "GRAPH";
const graphProvider = localStorageProvider<CausalGraph>();

const graphAtom = atom<CausalGraph>(graphProvider.load(graphKey) ?? {
  index: 0,
  shapeMap: {},
  orders: [],
  forwardSegmentMap: {},
  backwardSegmentMap: {},
});

function newRectNode(index: number, position: Vector): RectangleNode {
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
}

function newCircleNode(index: number, position: Vector): CircleNode {
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
}

function newSegment(index: number, position: Vector): GraphSegment {
  return {
    id: index,
    shapeType: "Segment",
    label: "",
    starting: vectorAdd(position, { x: 100, y: 0 }),
    ending: vectorAdd(position, { x: -100, y: 0 }),
    z: index,
  };
}

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
        forwardSegmentMap: prev.forwardSegmentMap,
        backwardSegmentMap: prev.backwardSegmentMap,
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
        forwardSegmentMap: prev.forwardSegmentMap,
        backwardSegmentMap: prev.backwardSegmentMap,
      };
    });
    return nn;
  };

  const addSegment = (position: Vector) => {
    const newIndex = graph.index + 1;
    const nn = newSegment(newIndex, position);
    setGraph((prev) => {
      return {
        index: newIndex,
        shapeMap: {
          ...prev.shapeMap,
          [nn.id]: nn,
        },
        orders: [...prev.orders, nn.id],
        forwardSegmentMap: prev.forwardSegmentMap,
        backwardSegmentMap: prev.backwardSegmentMap,
      };
    });
  }

  /**
   * 2つのノードを結ぶエッジを作成する
   * @param starting 
   * @param ending 
   */
  const linkUpNodes = (starting: number, ending: number) => {
    if (starting === ending) {
      console.warn("Cannot link a node to itself");
      return;
    }
    const newIndex = graph.index + 1;
    const edge: GraphSegment = {
      id: newIndex,
      shapeType: "Segment",
      label: "",
      starting,
      ending,
      z: newIndex,
    };
    setGraph((prev) => {
      const idPairFT = `${edge.starting}-${edge.ending}`;
      const idPairTF = `${edge.ending}-${edge.starting}`;
      const forwardSegmentMap: NodeSegmentMap = { ...prev.forwardSegmentMap, [idPairFT]: prev.forwardSegmentMap[idPairFT] || [] };
      const backwardSegmentMap: NodeSegmentMap = { ...prev.backwardSegmentMap, [idPairTF]: prev.backwardSegmentMap[idPairTF] || [] };
      forwardSegmentMap[idPairFT].push(edge.id);
      backwardSegmentMap[idPairTF].push(edge.id);

      return {
        index: newIndex,
        shapeMap: { ...prev.shapeMap, [edge.id]: edge },
        orders: [...prev.orders, edge.id],
        forwardSegmentMap,
        backwardSegmentMap,
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

  const updateSegment = (id: number, shape: Partial<GraphSegment>) => {
    const n = graph.shapeMap[id];
    if (!n) { return; }
    const newShape = { ...n, ...shape };
    setGraph((prev) => {
      return {
        ...prev,
        shapeMap: {
          ...prev.shapeMap,
          [id]: newShape,
        },
      };
    });
  };


  return {
    graph,
    addRectNode,
    addCircleNode,
    addSegment,
    updateNode,
    updateSegment,
    linkUpNodes,
  };
};

