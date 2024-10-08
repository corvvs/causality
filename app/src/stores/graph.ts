import { atom, useAtom } from "jotai";
import { CausalGraph, CircleNode, GraphSegment, GraphNode, RectangleNode, Vector, ShapeId, isGraphSegment, CausalGraphVersioned } from "../types";
import { localStorageProvider } from "../infra/localStorage";
import { vectorAdd } from "../libs/vector";
import { useState } from "react";

const graphKey = "GRAPH";
const graphProvider = localStorageProvider<CausalGraphVersioned>(graphKey);

const currentGraphVersion = "0.0.4";
function loadGraph() {
  const g = graphProvider.load();
  if (g && g.version === currentGraphVersion) {
    return g;
  }
  return null;
}
const graphAtom = atom<CausalGraphVersioned>(loadGraph() ?? {
  version: currentGraphVersion,
  index: 0,
  shapeMap: {},
  temporaryShapeMap: {},
  orders: [],
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
  }
}

function newSegment(index: number, position: Vector): GraphSegment {
  return {
    id: index,
    shapeType: "Segment",
    label: "",
    starting: vectorAdd(position, { x: +100, y: -50 }),
    ending: vectorAdd(position, { x: -100, y: +50 }),
    shape: {
    },
    z: index,
  };
}

export function getShapeForGraph(id: number, graph: CausalGraph) {
  return graph.temporaryShapeMap[id] || graph.shapeMap[id];
}

export function getActualShapeForGraph(id: number, graph: CausalGraph) {
  return graph.shapeMap[id];
}

export function useGraph() {
  const [graph, setGraph] = useAtom(graphAtom);
  const [commitCount, setCommitCount] = useState(0);

  const getShape = (id: number) => getShapeForGraph(id, graph);
  const getActualShape = (id: number) => getActualShapeForGraph(id, graph);

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
        ...prev,
        index: newIndex,
        shapeMap: {
          ...prev.shapeMap,
          [nn.id]: nn,
        },
        temporaryShapeMap: { ...prev.temporaryShapeMap },
        orders: [...prev.orders, nn.id],
      };
    });
    return nn;
  };

  const addCircleNode = (position: Vector) => {
    const newIndex = graph.index + 1;
    const nn = newCircleNode(newIndex, position);
    setGraph((prev) => {
      return {
        ...prev,
        index: newIndex,
        shapeMap: {
          ...prev.shapeMap,
          [nn.id]: nn,
        },
        temporaryShapeMap: { ...prev.temporaryShapeMap },
        orders: [...prev.orders, nn.id],
      };
    });
    return nn;
  };

  const addSegment = (position: Vector, modifier?: (segment: GraphSegment) => GraphSegment) => {
    const newIndex = graph.index + 1;
    let nn = newSegment(newIndex, position);
    if (modifier) {
      nn = modifier(nn);
    }
    console.log("addSegment", nn);
    setGraph((prev) => {
      return {
        ...prev,
        index: newIndex,
        shapeMap: {
          ...prev.shapeMap,
          [nn.id]: nn,
        },
        temporaryShapeMap: { ...prev.temporaryShapeMap },
        orders: [...prev.orders, nn.id],
      };
    });
    return nn;
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
      shape: {
      },
      z: newIndex,
    };
    setGraph((prev) => {
      return {
        ...prev,
        index: newIndex,
        shapeMap: { ...prev.shapeMap, [edge.id]: edge },
        temporaryShapeMap: { ...prev.temporaryShapeMap },
        orders: [...prev.orders, edge.id],
      };
    });
  };


  const updateNode = (shapeId: number, shape: Partial<GraphNode>) => {
    const s = graph.temporaryShapeMap[shapeId];
    if (!s) {
      console.warn(`[updateNode] no temporary entry found for shapeId: ${shapeId}`);
      return;
    }
    const newNode = { ...s, ...shape };
    setGraph((prev) => {
      return {
        ...prev,
        temporaryShapeMap: {
          ...prev.temporaryShapeMap,
          [shapeId]: newNode,
        },
      };
    });
  };

  const updateNodeDirectly = (shapeId: number, shape: Partial<GraphNode>) => {
    const s = graph.shapeMap[shapeId];
    if (!s) {
      console.warn(`[updateNode] no entry found for shapeId: ${shapeId}`);
      return;
    }
    const newNode = { ...s, ...shape };
    setGraph((prev) => {
      return {
        ...prev,
        shapeMap: {
          ...prev.shapeMap,
          [shapeId]: newNode,
        },
      };
    });
  };

  const updateSegment = (shapeId: number, shape: Partial<GraphSegment>) => {
    const s = graph.temporaryShapeMap[shapeId];
    if (!s) {
      console.warn("[updateSegment] no temporary entry found");
      return;
    }
    const newShape = { ...s, ...shape };
    setGraph((prev) => {
      return {
        ...prev,
        temporaryShapeMap: {
          ...prev.temporaryShapeMap,
          [shapeId]: newShape,
        },
      };
    });
  };

  const deleteNode = (shapeId: ShapeId) => {
    setGraph((prev) => {
      if (!prev.shapeMap[shapeId]) {
        console.warn("no entry found");
        return prev;
      }
      const newOrders = prev.orders.filter((id) => id !== shapeId);
      const newShapeMap = { ...prev.shapeMap };
      const newTemporaryShapeMap = { ...prev.temporaryShapeMap };

      function remove(tid: ShapeId) {
        const i = newOrders.findIndex((id) => id === tid);
        if (i >= 0) {
          newOrders.splice(i, 1);
        }
        delete newShapeMap[tid];
        delete newTemporaryShapeMap[tid];
      }

      remove(shapeId);
      // 削除対象に接続されているセグメントがあったら, それも削除する
      Object.keys(newShapeMap).forEach((id) => {
        const shape = newShapeMap[id as unknown as ShapeId];
        if (!isGraphSegment(shape)) {
          return;
        }
        if (shape.starting === shapeId || shape.ending === shapeId) {
          remove(shape.id);
        }
      });

      return {
        ...prev,
        shapeMap: newShapeMap,
        temporaryShapeMap: newTemporaryShapeMap,
        orders: newOrders,
      };
    });
  };

  /**
   * あるシェイプの編集操作を開始すると、そのシェイプ情報がgraph.shapeMapからgraph.temporaryShapeMapにコピーされる。
   */
  const startEdit = (id: number) => {
    if (graph.temporaryShapeMap[id]) {
      console.warn("detected unexpected temporary entry");
      return;
    }
    setGraph((prev) => {
      const shape = getActualShapeForGraph(id, prev);
      return {
        ...prev,
        temporaryShapeMap: {
          ...prev.temporaryShapeMap,
          [id]: { ...shape },
        },
      };
    });
  };

  /**
   * 編集操作が終了すると、graph.temporaryShapeMapの情報がgraph.shapeMapにコピーされ、graph.temporaryShapeMapのデータは削除される。
   */
  const commitEdit = (id: number) => {
    const shape = graph.temporaryShapeMap[id];
    if (!shape) {
      console.warn("no temporary shape");
      return;
    }
    const newTemporary = { ...graph.temporaryShapeMap };
    delete newTemporary[id];
    setGraph((prev) => {
      return {
        ...prev,
        shapeMap: {
          ...prev.shapeMap,
          [id]: { ...shape },
        },
        temporaryShapeMap: newTemporary,
      };
    });
    setCommitCount((prev) => prev + 1);
    console.log("[graph] committed.");
  };

  /**
   * なお、編集操作が「キャンセル」された場合は、単にgraph.temporaryShapeMapのデータを削除する(コピーはしない)。
   */
  const cancelEdit = (id: number) => {
    const shape = graph.temporaryShapeMap[id];
    if (!shape) {
      console.warn("no temporary entry found");
      return;
    }
    const newTemporary = { ...graph.temporaryShapeMap };
    delete newTemporary[id];
    setGraph((prev) => {
      return {
        ...prev,
        temporaryShapeMap: newTemporary,
      };
    });
  };

  const saveGraph = () => {
    graphProvider.save(graph);
    console.log("[graph] saved.")
  };


  return {
    graph: graph as CausalGraph,
    saveGraph,
    getShape,
    getActualShape,
    startEdit,
    commitEdit,
    cancelEdit,

    addRectNode,
    addCircleNode,
    addSegment,
    updateNode,
    updateNodeDirectly,
    updateSegment,
    deleteNode,
    linkUpNodes,
    commitCount,
  };
}

export type GraphUsed = ReturnType<typeof useGraph>;
