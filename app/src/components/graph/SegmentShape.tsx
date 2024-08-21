import { affineApply } from "../../libs/affine";
import { getPositionForTerminus, isFullyFree } from "../../libs/segment";
import { useDisplay } from "../../stores/display";
import { CausalGraph, GraphSegment, Vector } from "../../types";
import { ComponentWithProps, DraggableProps } from "../../types/components";
import { Reshaper } from "../../views/GraphView/types";
import { ReshaperCorner } from "./Reshaper";
import { ShapeProps } from "./types";


const Reshapers = (props: DraggableProps & {
  shape: GraphSegment;
  startCenter: Vector;
  endCenter: Vector;
}) => {
  const {
    startCenter, endCenter,
  } = props;
  const handleSize = 12;
  const rs: Reshaper = { type: "Start", center: startCenter, size: { width: handleSize, height: handleSize } };
  const re: Reshaper = { type: "End", center: endCenter, size: { width: handleSize, height: handleSize } };
  return <>
    <ReshaperCorner key={rs.type} reshaper={rs} {...props} />
    <ReshaperCorner key={re.type} reshaper={re} {...props} />
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

  const centers = getPositionForTerminus(shape, graph);
  const rStart = affineApply(affineFieldToTag, centers.starting);
  const rEnd = affineApply(affineFieldToTag, centers.ending);
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

export const SegmentShape: ComponentWithProps<ShapeProps<GraphSegment>> = (props) => {
  const {
    shape,
    graph,
  } = props;

  const centers = getPositionForTerminus(shape, graph);

  const lineWidth = shape.shape.line.lineWidth;
  const margin = lineWidth + 5;
  return <g>
    <line
      x1={centers.starting.x}
      y1={centers.starting.y}
      x2={centers.ending.x}
      y2={centers.ending.y}
      strokeWidth={lineWidth}
    />
    <line
      className="hit-target"
      x1={centers.starting.x}
      y1={centers.starting.y}
      x2={centers.ending.x}
      y2={centers.ending.y}
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
        props.mouseDown(e, { target: "segment", shapeId: shape.id, shape, });
        e.stopPropagation();
      }}
    />
  </g>;
};
