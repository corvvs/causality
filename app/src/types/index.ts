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
type ShapeType = NodeShapeType | "Segment";
export type ShapeId = number;


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

export function isRectangleNode(shape: GraphShape): shape is RectangleNode {
  return shape.shapeType === "Rectangle";
}

export function isCircleNode(shape: GraphShape): shape is CircleNode {
  return shape.shapeType === "Circle";
}

export function isGraphSegment(shape: GraphShape): shape is GraphSegment {
  return shape.shapeType === "Segment";
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

/**
 * セグメントの端点を表す型
 * ShapeId であればなんらかのシェイプに接続していることを示す
 * Vector であれば座標を示す
 */
export type SegmentBond = ShapeId | Vector;

export type GraphSegment = GraphShape & {
  shapeType: "Segment";
  starting: SegmentBond;
  ending: SegmentBond;
  z: number;
};

export function isBondedToShape(bond: SegmentBond): bond is ShapeId {
  return typeof bond === "number";
}

export type NodeSegmentMap = {
  [id_pair: string]: ShapeId[];
};

export type CausalGraph = {
  index: number;
  shapeMap: { [id: ShapeId]: GraphShape };
  temporaryShapeMap: { [id: ShapeId]: GraphShape };
  orders: ShapeId[];
}

export type CausalDisplay = {
  origin: Vector;
  magnitude: number;
};
