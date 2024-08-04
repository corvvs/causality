type GenericFields = {
  id: string;
  label: string | null;
};

export type Vector = {
  x: number;
  y: number;
};

/**
 * 一般的な線の形状情報
 */
type LineShape = {
  lineWidth: number;
};

export type GraphNode = GenericFields & {
  nodeType: string;
  position: Vector;
  z: number;
};

type RectangleShape = {
  height: number;
  width: number;
  line: LineShape;
};

export type RectangleNode = GraphNode & {
  nodeType: "Rectangle";
  shape: RectangleShape;
};

type CircleShape = {
  radius: number;
  line: LineShape;
};

export type CircleNode = GraphNode & {
  nodeType: "Circle";
  shape: CircleShape;
};

export type GraphEdge = GenericFields & {
  startNodeId: string;
  endNodeId: string;
  z: number;
};

export type CausalGraph = {
  index: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type CausalDisplay = {
  origin: Vector;
  scale: number;
};
