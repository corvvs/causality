type GenericFields = {
  id: string;
  label: string | null;
};

export type Vector = {
  x: number;
  y: number;
};

export type Rectangle = {
  r0: Vector;
  r1: Vector;
};

export type Size = {
  width: number;
  height: number;
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
  size: Size;
  z: number;
};

type RectangleShape = {
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
  nodes: { [id: string]: GraphNode };
  nodeOrder: string[];
  edges: GraphEdge[];
}

export type CausalDisplay = {
  origin: Vector;
  magnitude: number;
};
