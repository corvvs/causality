import { minBy } from "es-toolkit";
import { getShapeForGraph } from "../stores/graph";
import { CausalGraph, CircleNode, GraphSegment, GraphShape, isBondedToShape, isCircleNode, isGraphNode, isRectangleNode, PositionDirection, RectangleNode, SegmentBond, TerminusBoundaries, Vector } from "../types";
import { getNodeCenter } from "./shape";
import { vectorDot, vectorMid, vectorSub } from "./vector";

function getPositionForBond(bond: SegmentBond, graph: CausalGraph): Vector {
  if (isBondedToShape(bond)) {
    const shape = getShapeForGraph(bond, graph);
    if (!isGraphNode(shape)) { throw new Error(`invalid shapeId: ${bond}`); }
    return getNodeCenter(shape);
  } else {
    return bond;
  }
}

function getActualPositionForNominalCircle(r0: Vector, r1: Vector, shape0: CircleNode): PositionDirection {

  let maxD: number = Infinity;
  let answer: PositionDirection = {
    position: r0,
    direction: vectorSub(r1, r0),
  };
  
  const w = shape0.size.width / 2;
  const h = shape0.size.height / 2;
for (let i = 0; i < 4; i++) {
    const phi = Math.PI / 2 * i;
    const d = { x: w * Math.cos(phi), y: h * Math.sin(phi) };
    const x = shape0.position.x + w / 2 + d.x;
    const y = shape0.position.y + h / 2 + d.y;
    const v = vectorSub(r1, { x, y });
    const vv = vectorDot(v, v);
    if (vv < maxD) {
      maxD = vv;
      answer = {
        position: { x, y },
        direction: d,
      };
    }
  }
  return answer;

  // const azimuth = Math.atan2(r1.y - r0.y, r1.x - r0.x);
  // const a = shape0.size.width / 2;
  // const b = shape0.size.height / 2;
  // const rr = Math.pow(Math.cos(azimuth) / a, 2) + Math.pow(Math.sin(azimuth) / b, 2);
  // const r = Math.sqrt(1 / rr);
  // return {
  //   x: r0.x + r * Math.cos(azimuth),
  //   y: r0.y + r * Math.sin(azimuth),
  // };
}

function getActualPositionForNominalRectangle(r0: Vector, r1: Vector, shape0: RectangleNode): PositionDirection {
  const w = shape0.size.width / 2;
  const h = shape0.size.height / 2;
  const mids: PositionDirection[] = [
    {
      // N
      position: vectorMid({ x: r0.x - w, y: r0.y - h }, { x: r0.x + w, y: r0.y - h }),
      direction: { x: 0, y: -h },
    },
    {
      // W
      position: vectorMid({ x: r0.x - w, y: r0.y - h }, { x: r0.x - w, y: r0.y + h }),
      direction: { x: -w, y: 0 },
    },
    { // E
      position: vectorMid({ x: r0.x + w, y: r0.y + h }, { x: r0.x + w, y: r0.y - h }),
      direction: { x: +w, y: -1 },
    },
    {
      // S
      position: vectorMid({ x: r0.x + w, y: r0.y + h }, { x: r0.x - w, y: r0.y + h }),
      direction: { x: 0, y: +h },
    },
  ];
  return minBy(mids, (mid) => vectorDot(vectorSub(r1, mid.position), vectorSub(r1, mid.position)));

  // const corners: Vector[] = [
  //   { x: shape0.position.x, y: shape0.position.y }, // top-left
  //   { x: shape0.position.x + shape0.size.width, y: shape0.position.y }, // top-right
  //   { x: shape0.position.x + shape0.size.width, y: shape0.position.y + shape0.size.height }, // bottom-right
  //   { x: shape0.position.x, y: shape0.position.y + shape0.size.height }, // bottom-left
  // ];

  // const cornerToConers: Vector[] = [
  //   vectorSub(corners[1], corners[0]),
  //   vectorSub(corners[2], corners[1]),
  //   vectorSub(corners[3], corners[2]),
  //   vectorSub(corners[0], corners[3]),
  // ];

  // const r0r1 = vectorSub(r1, r0);
  // let minT: number = 1;
  // let answer: Vector = r0;
  // for (let i = 0; i < 4; i++) {
  //   const r0s0 = vectorSub(corners[i], r0);
  //   const s0s1 = cornerToConers[i];
  //   const sdash = cornerToConers[(i + 1) % 4];
  //   const t = vectorDot(r0s0, sdash) / vectorDot(r0r1, sdash);
  //   const q = vectorDot(vectorSub(vectorMul(r0r1, t), r0s0), s0s1) / vectorDot(s0s1, s0s1);
  //   if (0 <= q && q <= 1 && 0 <= t) {
  //     if (t < minT) {
  //       minT = t;
  //       answer = vectorAdd(r0, vectorMul(r0r1, t));
  //     }
  //   }
  // }
  // return answer;
}

function getActualPositionForNominal(r0: Vector, r1: Vector, shape0: GraphShape) {
  if (isCircleNode(shape0)) {
    return getActualPositionForNominalCircle(r0, r1, shape0);
  }
  if (isRectangleNode(shape0)) {
    return getActualPositionForNominalRectangle(r0, r1, shape0);
  }
  return {
    position: r0,
    direction: vectorSub(r1, r0),
  };
}

export function getPositionForTerminus(segment: GraphSegment, graph: CausalGraph): TerminusBoundaries {
  const nominal = {
    starting: getPositionForBond(segment.starting, graph),
    ending: getPositionForBond(segment.ending, graph),
  };

  const actualStarting: PositionDirection = isBondedToShape(segment.starting)
    ? getActualPositionForNominal(nominal.starting, nominal.ending, getShapeForGraph(segment.starting, graph))
    : {
      position: nominal.starting,
      direction: vectorSub(nominal.ending, nominal.starting),
    };
  const actualEnding: PositionDirection = isBondedToShape(segment.ending)
    ? getActualPositionForNominal(nominal.ending, nominal.starting, getShapeForGraph(segment.ending, graph))
    : {
      position: nominal.ending,
      direction: vectorSub(nominal.starting, nominal.ending),
    };
  return {
    starting: actualStarting,
    ending: actualEnding,
  };
}

export function isFullyBonded(segment: GraphSegment) {
  return isBondedToShape(segment.starting) && isBondedToShape(segment.ending);
}

export function isFullyFree(segment: GraphSegment) {
  return !isBondedToShape(segment.starting) && !isBondedToShape(segment.ending);
}
