import { wrapForTouchGeneric } from "../../libs/touch";
import { GraphShape, RectangleLikeNode } from "../../types";
import { DraggableProps, LinkingProps } from "../../types/components";
import { Linker, Reshaper, ReshaperCursor } from "../../views/GraphView/types";

export const ReshapeHandleSide = (props: DraggableProps & {
  shape: GraphShape;
  reshaper: Reshaper;
}) => {
  const { reshaper, shape, mouseDownForDragging } = props;
  return <rect
    key={reshaper.type}
    className={`causality reshaper-side stroke-transparent fill-transparent`}
    style={{ cursor: ReshaperCursor[reshaper.type] }}
    x={reshaper.center.x - reshaper.size.width / 2} y={reshaper.center.y - reshaper.size.height / 2}
    width={reshaper.size.width} height={reshaper.size.height}
    onMouseDown={(e) => {
      if (!mouseDownForDragging) { return; }
      mouseDownForDragging(e, { target: "reshaper", shapeId: shape.id, resizerType: reshaper.type, shape });
      e.stopPropagation();
    }}
    onTouchStart={(e) => {
      if (!mouseDownForDragging) { return; }
      wrapForTouchGeneric(
        (e) => { mouseDownForDragging(e, { target: "reshaper", shapeId: shape.id, resizerType: reshaper.type, shape }); }
      )(e);
      e.stopPropagation();
    }}
    onClick={(e) => {
      e.stopPropagation();
    }}
  />
}

export const ReshaperHandleCorner = (props: DraggableProps & {
  shape: GraphShape;
  reshaper: Reshaper;
}) => {
  const { reshaper, shape, mouseDownForDragging } = props;
  return <rect
    key={reshaper.type}
    className={`causality reshaper-corner stroke-1 hover:fill-blue-400`}
    style={{ cursor: ReshaperCursor[reshaper.type] }}
    x={reshaper.center.x - reshaper.size.width / 2} y={reshaper.center.y - reshaper.size.height / 2}
    width={reshaper.size.width} height={reshaper.size.height}
    onMouseDown={(e) => {
      if (!mouseDownForDragging) { return; }
      mouseDownForDragging(e, { target: "reshaper", shapeId: shape.id, resizerType: reshaper.type, shape });
      e.stopPropagation();
    }}
    onTouchStart={(e) => {
      if (!mouseDownForDragging) { return; }
      wrapForTouchGeneric(
        (e) => { mouseDownForDragging(e, { target: "reshaper", shapeId: shape.id, resizerType: reshaper.type, shape }); }
      )(e);
      e.stopPropagation();
    }}
    onClick={(e) => {
      e.stopPropagation();
    }}
  />
}

export const LinkHandle = (props: LinkingProps & {
  shape: RectangleLikeNode;
  scale: number;
  linker: Linker;
}) => {
  const { linker, mouseDownForLinking, shape } = props;

  return <circle
    key={linker.type}
    className={`causality linker stroke-1`}
    cx={linker.center.x} cy={linker.center.y}
    r={linker.radius}
    onMouseDown={(e) => {
      if (!mouseDownForLinking) { return; }
      mouseDownForLinking(e, shape);
      e.stopPropagation();
    }}
    onTouchStart={(e) => {
      if (!mouseDownForLinking) { return; }
      wrapForTouchGeneric(
        (e) => { mouseDownForLinking(e, shape); }
      )(e);
      e.stopPropagation();
    }}
    onClick={(e) => {
      e.stopPropagation();
    }}
  />
};