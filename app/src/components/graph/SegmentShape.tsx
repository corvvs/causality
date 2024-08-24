import { affineApply } from "../../libs/affine";
import { getPositionForTerminus, isFullyFree } from "../../libs/segment";
import { wrapForTouchGeneric } from "../../libs/touch";
import { useDisplay } from "../../stores/display";
import { CausalGraph, getLineWidth, GraphSegment, Vector } from "../../types";
import { ComponentWithProps, DraggableProps } from "../../types/components";
import { DraggableMatter, Reshaper } from "../../views/GraphView/types";
import { ReshaperHandleCorner } from "./ReshapeHandle";
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
    <ReshaperHandleCorner key={rs.type} reshaper={rs} {...props} />
    <ReshaperHandleCorner key={re.type} reshaper={re} {...props} />
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

export const SegmentShapeElement: ComponentWithProps<ShapeProps<GraphSegment>> = (props) => {
  const {
    shape,
    graph,
    mouseDownForDragging,
  } = props;

  const centers = getPositionForTerminus(shape, graph);

  const lineWidth = getLineWidth(shape)
  const margin = lineWidth + 20;
  const draggableMatter: DraggableMatter = { target: "segment", shapeId: shape.id, shape, }
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
        if (!props.clickForSelection) { return; }
        props.clickForSelection(e, shape);
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        if (!mouseDownForDragging) { return; }
        if (!isFullyFree(shape)) { return; }
        mouseDownForDragging(e, draggableMatter);
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        if (!mouseDownForDragging) { return; }
        wrapForTouchGeneric((e) => mouseDownForDragging(e, draggableMatter))(e);
        e.stopPropagation();
      }}
    />
  </g>;
};
