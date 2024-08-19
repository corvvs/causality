import { getShapeForGraph } from "../stores/graph";
import { CausalGraph, GraphSegment, isBondedToShape, isGraphNode, SegmentBond, Vector } from "../types";
import { getNodeCenter } from "./shape";

export function getPositionForBond(bond: SegmentBond, graph: CausalGraph): Vector {
  if (isBondedToShape(bond)) {
    const shape = getShapeForGraph(bond, graph);
    if (!isGraphNode(shape)) { throw new Error(`invalid shapeId: ${bond}`); }
    return getNodeCenter(shape);
  } else {
    return bond;
  }
}

export function isFullyBonded(segment: GraphSegment) {
  return isBondedToShape(segment.starting) && isBondedToShape(segment.ending);
}

export function isFullyFree(segment: GraphSegment) {
  return !isBondedToShape(segment.starting) && !isBondedToShape(segment.ending);
}
