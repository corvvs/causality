import { GraphShape } from "../../types";
import { DraggableProps } from "../../types/components";
import { Reshaper, ReshaperCursor } from "../../views/GraphView/types";

export const ReshaperSide = (props: DraggableProps & {
  shape: GraphShape;
  reshaper: Reshaper;
}) => {
  const { reshaper, shape, mouseDown } = props;
  return <rect
    key={reshaper.type}
    className={`reshaper-side ${ReshaperCursor[reshaper.type]!} stroke-transparent fill-transparent`}
    x={reshaper.center.x - reshaper.size.width / 2} y={reshaper.center.y - reshaper.size.height / 2}
    width={reshaper.size.width} height={reshaper.size.height}
    onMouseDown={(e) => {
      if (!mouseDown) { return; }
      mouseDown(e, { target: "reshaper", nodeId: shape.id, resizerType: reshaper.type });
      e.stopPropagation();
    }}
    onClick={(e) => {
      e.stopPropagation();
    }}
  />
}

export const ReshaperCorner = (props: DraggableProps & {
  shape: GraphShape;
  reshaper: Reshaper;
}) => {
  const { reshaper, shape, mouseDown } = props;
  return <rect
    key={reshaper.type}
    className={`reshaper-corner ${ReshaperCursor[reshaper.type]} stroke-1 hover:fill-blue-400`}
    x={reshaper.center.x - reshaper.size.width / 2} y={reshaper.center.y - reshaper.size.height / 2}
    width={reshaper.size.width} height={reshaper.size.height}
    onMouseDown={(e) => {
      if (!mouseDown) { return; }
      mouseDown(e, { target: "reshaper", nodeId: shape.id, resizerType: reshaper.type });
      e.stopPropagation();
    }}
    onClick={(e) => {
      e.stopPropagation();
    }}
  />
}
