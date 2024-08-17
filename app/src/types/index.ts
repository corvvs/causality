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

type NodeShapeType = "Rectangle" | "Circle";
type ShapeType = NodeShapeType | "Edge";
type ShapeId = number;


export type GraphShape = GenericFields & AppearanceFields & {
  shapeType: ShapeType;
  z: number;
};

export type GraphNode = GraphShape & {
  shapeType: NodeShapeType;
  position: Vector;
  size: Size;
};

export function isGraphNode(shape: GraphShape): shape is GraphNode {
  return shape.shapeType === "Rectangle" || shape.shapeType === "Circle";
}

type RectangleLikeShape = {
  line: LineShape;
};

type RectangleShape = RectangleLikeShape;
type CircleShape = RectangleLikeShape;

export type RectangleLikeNode = GraphNode & {
  shape: RectangleLikeShape;
}

export type RectangleNode = GraphNode & {
  shapeType: "Rectangle";
  shape: RectangleShape;
};

export type CircleNode = GraphNode & {
  shapeType: "Circle";
  shape: CircleShape;
};

export type GraphEdge = GraphShape & {
  shapeType: "Edge";
  startNodeId: ShapeId;
  endNodeId: ShapeId;
  z: number;
};

export type NodeEdgeMap = {
  [id_pair: string]: ShapeId[];
};

export type CausalGraph = {
  index: number;
  shapeMap: { [id: ShapeId]: GraphShape };
  orders: ShapeId[];
  forwardEdgeMap: NodeEdgeMap;
  backwardEdgeMap: NodeEdgeMap;
}

export type CausalDisplay = {
  origin: Vector;
  magnitude: number;
};
