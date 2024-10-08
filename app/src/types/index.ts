type ColorName = string;
type ColorHex = `#${string}`;
export type ColorValue = ColorName | ColorHex;

export type Vector = {
  x: number;
  y: number;
};

export type PositionDirection = {
  position: Vector;
  direction: Vector;
};

export type TerminusBoundaries = {
  starting: PositionDirection;
  ending: PositionDirection;
};

export type Rectangle = {
  r0: Vector;
  r1: Vector;
};

export type Size = {
  width: number;
  height: number;
};

// ラベル属性
export type LabelAppearance = {
  id: ShapeId;
	labelFont?: string;
	labelSize?: number;
	labelColor?: ColorValue;
};

// 線のスタイル; 実線, 点線, 波線
type LineStyle = "continuous" | "dotted" | "dashed";

// 線の属性
export type LineAppearance = {
  id: ShapeId;
	lineWidth?: number;
	lineColor?: ColorValue;
	lineStyle?: LineStyle;
};

const defaultLineWidth = 2;
export const defaultLineStyle: LineStyle = "continuous";
export function getLineWidth(shape: LineAppearance) {
  return shape.lineWidth ?? defaultLineWidth;
}

// 長方形様形状の属性
export type RectangleLikeAppearance = {
	size: Size;
};

export type FillableAppearance = {
  fillColor?: ColorValue;
  fillOpacity?: number;
};

// 端点のスタイル
export type TerminusStyle = "arrow-head" | "circle";

// 端点の属性
export type TerminusAppearance = {
	terminusStyle?: TerminusStyle;
};

// 線分のスタイル; 直線, 折れ線, 曲線
export const SegmentStyles = ["straight", "zigzag", "curve"] as const;
export type SegmentStyle = typeof SegmentStyles[number];
export function getSegmentStyle(shape: GraphSegment) {
  return shape.segmentStyle ?? SegmentStyles[0];
}

// 線分の属性
export type SegmentAppearance = {
	segmentStyle?: SegmentStyle;
};

type GenericFields = {
  id: number;
  label: string | null;
};

type NodeShapeType = "Rectangle" | "Circle";
type ShapeType = NodeShapeType | "Segment";
export type ShapeId = number;


export type GraphShape = GenericFields
  & LabelAppearance
  & {
  shapeType: ShapeType;
  z: number;
};

export type GraphNode = GraphShape & FillableAppearance & {
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

export function isShapeFillable(shape: GraphShape) {
  return isCircleNode(shape) || isRectangleNode(shape);
}

export function hasLine(shape: unknown): shape is LineAppearance {
  const s = shape as GraphShape;
  return isCircleNode(s) || isRectangleNode(s) || isGraphSegment(s);
}

export function hasLabel(shape: GraphShape) {
  return isCircleNode(shape) || isRectangleNode(shape);
}

export function hasSegmentStyle(shape: GraphShape) {
  return isGraphSegment(shape);
}

type RectangleLikeShape = LineAppearance;

type RectangleShape = RectangleLikeShape;
type CircleShape = RectangleLikeShape;

export type RectangleLikeNode = GraphNode & RectangleLikeShape;

export type RectangleNode = GraphNode & RectangleShape &{
  shapeType: "Rectangle";
};

export type CircleNode = GraphNode & CircleShape & {
  shapeType: "Circle";
};

/**
 * セグメントの端点を表す型
 * ShapeId であればなんらかのシェイプに接続していることを示す
 * Vector であれば座標を示す
 */
export type SegmentBond = ShapeId | Vector;

export type GraphSegment = GraphShape & LineAppearance & SegmentAppearance & {
  shapeType: "Segment";
  starting: SegmentBond;
  ending: SegmentBond;
  shape: {
    staring?: TerminusAppearance;
    ending?: TerminusAppearance;
  };
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

export type CausalGraphVersioned = CausalGraph & {
  version: string;
};

export type CausalDisplay = {
  origin: Vector;
  magnitude: number;
};
export type CausalDisplayVersioned = CausalDisplay & {
  version: string;
};
