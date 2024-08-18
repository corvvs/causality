import { affineApply } from "../../libs/affine";
import { getNodeCenter } from "../../libs/shape";
import { vectorMid } from "../../libs/vector";
import { useDisplay } from "../../stores/display";
import { CausalGraph, GraphSegment, isBondedToShape, isGraphNode, SegmentBond, Vector } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { Reshaper } from "../../views/GraphView/types";
import { ReshaperCorner } from "./Reshaper";
import { CommonProps } from "./types";

export function positionForBond(bond: SegmentBond, graph: CausalGraph): Vector {
  if (isBondedToShape(bond)) {
    const shape = graph.shapeMap[bond];
    if (!isGraphNode(shape)) { throw new Error(`invalid shapeId: ${bond}`); }
    return getNodeCenter(shape);
  } else {
    return bond;
  }
}

const Reshapers = (props: DraggableProps & {
  shape: GraphSegment;
  startCenter: Vector;
  endCenter: Vector;
}) => {
  const {
    startCenter, endCenter,
  } = props;
  const handleSize = 12;
  const centers: Reshaper[] = [
    { type: "Start", center: startCenter, size: { width: handleSize, height: handleSize } },
    { type: "End", center: endCenter, size: { width: handleSize, height: handleSize } },
  ];

  return <>
    {centers.map((rs) => <ReshaperCorner key={rs.type} reshaper={rs} {...props} />)}
  </>
};

export const SvgSegmentSelectedShape: ComponentWithProps<{ shape: GraphSegment; graph: CausalGraph } & DraggableProps> = (props) => {
  const {
    shape,
    graph,
  } = props;
  const {
    affineFieldToTag,
  } = useDisplay();

  const startCenter = positionForBond(shape.starting, graph);
  const endCenter = positionForBond(shape.ending, graph);
  const rStart = affineApply(affineFieldToTag, startCenter);
  const rEnd = affineApply(affineFieldToTag, endCenter);
  return <>
    <line
      className="segment-selection-box pointer-events-none"
      x1={rStart.x}
      y1={rStart.y}
      x2={rEnd.x}
      y2={rEnd.y}
      strokeWidth={1.5}
    />

    <Reshapers {...props} startCenter={rStart} endCenter={rEnd} />
  </>;
};

export const SvgSegmentShape: ComponentWithProps<CommonProps<GraphSegment> & DraggableProps & SelectiveProps> = (props) => {
  const {
    shape,
    graph,
  } = props;

  const startCenter = positionForBond(shape.starting, graph);
  const endCenter = positionForBond(shape.ending, graph);

  const center = vectorMid(startCenter, endCenter);
  const basePosition = center;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;

  return <g
    style={{
      transform: baseTranslation,
    }}
  >
    <line
      x1={startCenter.x - center.x}
      y1={startCenter.y - center.y}
      x2={endCenter.x - center.x}
      y2={endCenter.y - center.y}
      onClick={(e) => {
        if (!props.click) { return; }
        props.click(e, shape);
        e.stopPropagation();
      }}
    />
  </g>;
};
