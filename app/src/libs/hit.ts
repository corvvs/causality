import { CircleNode, GraphShape, RectangleNode, Vector } from "../types";

function isHitRectangle(r: Vector, shape: RectangleNode) {
  const { position, size } = shape;
  return position.x <= r.x && r.x <= position.x + size.width
    && position.y <= r.y && r.y <= position.y + size.height;
}

function isHitCircle(r: Vector, shape: CircleNode) {
  const { position, size } = shape;
  const hw = size.width / 2;
  const hh = size.height / 2;
  const dx = (r.x - (position.x + hw)) / hw;
  const dy = (r.y - (position.y + hh)) / hh;
  return dx * dx + dy * dy <= 1;
}

export function isHit(r: Vector, shape: GraphShape): boolean {
  switch (shape.shapeType) {
    case "Rectangle":
      return isHitRectangle(r, shape as RectangleNode);
    case "Circle":
      return isHitCircle(r, shape as CircleNode);
    default:
      return false;
  }
}
