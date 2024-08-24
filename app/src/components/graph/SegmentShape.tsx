import { affineApply } from "../../libs/affine";
import { getPositionForTerminus, isFullyFree } from "../../libs/segment";
import { wrapForTouchGeneric } from "../../libs/touch";
import { useDisplay } from "../../stores/display";
import { CausalGraph, getLineWidth, getSegmentStyle, GraphSegment, TerminusBoundaries, Vector } from "../../types";
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
  const rStart = affineApply(affineFieldToTag, centers.starting.position);
  const rEnd = affineApply(affineFieldToTag, centers.ending.position);
  return <>
    <line
      className="causality segment-selection-box pointer-events-none"
      x1={rStart.x}
      y1={rStart.y}
      x2={rEnd.x}
      y2={rEnd.y}
      strokeWidth={1.5}
    />

    <Reshapers {...props} startCenter={rStart} endCenter={rEnd} />
  </>;
};

const ActualSegment: ComponentWithProps<{
  draggableMatter?: DraggableMatter;
  centers: TerminusBoundaries;
  strokeWidth: number;
} & ShapeProps<GraphSegment>> = (props) => {
  const {
    draggableMatter,
    centers,
    shape,
    clickForSelection,
    mouseDownForDragging,
    strokeWidth,
  } = props;

  const additionalProps = draggableMatter ? {
    className: "causality hit-target",
    onClick: (e: React.MouseEvent<SVGLineElement>) => {
      if (!clickForSelection) { return; }
      clickForSelection(e, shape);
      e.stopPropagation();
    },
    onMouseDown: (e: React.MouseEvent<SVGLineElement>) => {
      if (!mouseDownForDragging) { return; }
      if (!isFullyFree(shape)) { return; }
      mouseDownForDragging(e, draggableMatter);
      e.stopPropagation();
    },
    onTouchStart: (e: React.TouchEvent<SVGLineElement>) => {
      if (!mouseDownForDragging) { return; }
      wrapForTouchGeneric((e) => mouseDownForDragging(e, draggableMatter))(e);
      e.stopPropagation();
    }
  } : {
    className: "causality pointer-events-none",
  };

  switch (getSegmentStyle(shape)) {
    case "curve": {
      const sx = centers.starting.position.x;
      const sy = centers.starting.position.y;
      const ax = centers.starting.position.x + centers.starting.direction.x;
      const ay = centers.starting.position.y + centers.starting.direction.y;
      const bx = centers.ending.position.x + centers.ending.direction.x;
      const by = centers.ending.position.y + centers.ending.direction.y;
      const ex = centers.ending.position.x;
      const ey = centers.ending.position.y;
      return <path
        d={`M ${sx} ${sy} C ${ax} ${ay} ${bx} ${by} ${ex} ${ey}`}
        strokeWidth={strokeWidth}
        fill="transparent"
        {...additionalProps}
      />
    }
    default: {
      return <line
        x1={centers.starting.position.x}
        y1={centers.starting.position.y}
        x2={centers.ending.position.x}
        y2={centers.ending.position.y}
        strokeWidth={strokeWidth}
        {...additionalProps}
      />
    }
  }
};

export const SegmentShapeElement: ComponentWithProps<ShapeProps<GraphSegment>> = (props) => {
  const {
    shape,
    graph,
  } = props;

  const centers = getPositionForTerminus(shape, graph);

  const lineWidth = getLineWidth(shape)
  const margin = lineWidth + 20;
  const draggableMatter: DraggableMatter = { target: "segment", shapeId: shape.id, shape, }
  return <g>
    <ActualSegment {...props} centers={centers} strokeWidth={lineWidth} />
    <ActualSegment {...props} centers={centers} strokeWidth={margin} draggableMatter={draggableMatter}
    />
  </g>;
};
