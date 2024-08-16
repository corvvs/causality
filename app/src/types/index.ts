type ColorName = string;
type ColorHex = `#${string}`;
export type ColorValue = ColorName | ColorHex;

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

type AppearanceFields = {
  labelColor?: ColorValue;
};

type GenericFields = {
  id: number;
  label: string | null;
};

/**
 * 一般的な線の形状情報
 */
type LineShape = {
  lineWidth: number;
};

export type GraphNode = GenericFields & AppearanceFields & {
  nodeType: string;
  position: Vector;
  size: Size;
  z: number;
};

type RectangleLikeShape = {
  line: LineShape;
};

type RectangleShape = RectangleLikeShape;

type CircleShape = RectangleLikeShape;

export type RectangleLikeNode = GraphNode & {
  shape: RectangleLikeShape;
}

export type RectangleNode = GraphNode & {
  nodeType: "Rectangle";
  shape: RectangleShape;
};

export type CircleNode = GraphNode & {
  nodeType: "Circle";
  shape: CircleShape;
};

export type GraphEdge = GenericFields & {
  startNodeId: number;
  endNodeId: number;
  z: number;
};

export type CausalGraph = {
  index: number;
  nodes: { [id: number]: GraphNode };
  nodeOrder: number[];
  edges: GraphEdge[];
}

export type CausalDisplay = {
  origin: Vector;
  magnitude: number;
};
