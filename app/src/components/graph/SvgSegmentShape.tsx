import { affineApply } from "../../libs/affine";
import { getPositionForBond, isFullyFree } from "../../libs/segment";
import { vectorMid } from "../../libs/vector";
import { useDisplay } from "../../stores/display";
import { CausalGraph, GraphSegment, Vector } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { Reshaper } from "../../views/GraphView/types";
import { ReshaperCorner } from "./Reshaper";
import { CommonProps } from "./types";


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

  const startCenter = getPositionForBond(shape.starting, graph);
  const endCenter = getPositionForBond(shape.ending, graph);
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

  const startCenter = getPositionForBond(shape.starting, graph);
  const endCenter = getPositionForBond(shape.ending, graph);

  const center = vectorMid(startCenter, endCenter);
  const basePosition = center;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;

  const lineWidth = 1;
  const margin = lineWidth + 5;
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
      strokeWidth={lineWidth}
    />
    <line
      className="hit-target"
      x1={startCenter.x - center.x}
      y1={startCenter.y - center.y}
      x2={endCenter.x - center.x}
      y2={endCenter.y - center.y}
      strokeWidth={margin}
      onClick={(e) => {
        if (!props.click) { return; }
        props.click(e, shape);
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        console.log("mouseDown");
        if (!props.mouseDown) { return; }
        if (!isFullyFree(shape)) { return; }
        console.log(shape);
        props.mouseDown(e, { target: "segment", segmentId: shape.id });
        e.stopPropagation();
      }}
    />
  </g>;
};
