import { Vector } from "../types";

export function vectorAdd(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function vectorSub(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function vectorMid(a: Vector, b: Vector): Vector {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function vectorMul(a: Vector, b: number): Vector {
  return { x: a.x * b, y: a.y * b };
}

export function vectorDot(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y;
}
