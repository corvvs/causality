import { affineApply } from "../../libs/affine";
import { useDisplay } from "../../stores/display";
import { getLineWidth, RectangleLikeNode, Vector } from "../../types";
import { ComponentWithProps, DraggableProps, LinkingProps } from "../../types/components";
import { Linker, Reshaper } from "../../views/GraphView/types";
import { ReshaperHandleCorner, ReshapeHandleSide, LinkHandle } from "./ReshapeHandle";


const Reshapers = (props: DraggableProps & {
  shape: RectangleLikeNode;
  rNorthWest: Vector;
  rSouthEast: Vector;
}) => {
  const {
    rNorthWest, rSouthEast,
  } = props;
  const rw = rSouthEast.x - rNorthWest.x;
  const rh = rSouthEast.y - rNorthWest.y;

  const handleSize = 12;

  const centers1: Reshaper[] = [
    { type: "N", center: { x: (rNorthWest.x + rSouthEast.x) / 2, y: rNorthWest.y }, size: { width: rw, height: handleSize } },
    { type: "W", center: { x: rNorthWest.x, y: (rNorthWest.y + rSouthEast.y) / 2 }, size: { width: handleSize, height: rh } },
    { type: "S", center: { x: (rNorthWest.x + rSouthEast.x) / 2, y: rSouthEast.y }, size: { width: rw, height: handleSize } },
    { type: "E", center: { x: rSouthEast.x, y: (rNorthWest.y + rSouthEast.y) / 2 }, size: { width: handleSize, height: rh } },
  ];

  const centers2: Reshaper[] = [
    { type: "NW", center: rNorthWest, size: { width: handleSize, height: handleSize } },
    { type: "SW", center: { x: rNorthWest.x, y: rSouthEast.y }, size: { width: handleSize, height: handleSize } },
    { type: "SE", center: rSouthEast, size: { width: handleSize, height: handleSize } },
    { type: "NE", center: { x: rSouthEast.x, y: rNorthWest.y }, size: { width: handleSize, height: handleSize } },
  ];

  return <>
    {centers1.map((rs) => <ReshapeHandleSide key={rs.type} reshaper={rs} {...props} />)}
    {centers2.map((rs) => <ReshaperHandleCorner key={rs.type} reshaper={rs} {...props} />)}
  </>;
};

const LinkHandles = (props: LinkingProps & {
  rNorthWest: Vector;
  rSouthEast: Vector;
  shape: RectangleLikeNode;
  scale: number;
}) => {

  const {
    rNorthWest,
    rSouthEast,
  } = props;

  const handleRadius = 5;
  const margin = 20;

  const centers: Linker[] = [
    { type: "N", center: { x: (rNorthWest.x + rSouthEast.x) / 2, y: rNorthWest.y - margin }, radius: handleRadius },
    { type: "W", center: { x: rNorthWest.x - margin, y: (rNorthWest.y + rSouthEast.y) / 2 }, radius: handleRadius },
    { type: "S", center: { x: (rNorthWest.x + rSouthEast.x) / 2, y: rSouthEast.y + margin }, radius: handleRadius },
    { type: "E", center: { x: rSouthEast.x + margin, y: (rNorthWest.y + rSouthEast.y) / 2 }, radius: handleRadius },
  ];

  return <>
    {centers.map((rs) => <LinkHandle key={rs.type} linker={rs} {...props} />)}
  </>;
};

export const SvgNodeRectangleLikeSelectedShape: ComponentWithProps<
  { shape: RectangleLikeNode } & DraggableProps & LinkingProps
> = (props) => {
  const { shape } = props;
  const {
    scale,
    affineFieldToTag,
  } = useDisplay();

  const lineWidth = getLineWidth(shape.shape);
  const boxMargin = (lineWidth + 1) * scale / 2;

  const x0 = shape.position.x;
  const y0 = shape.position.y;
  const x1 = shape.position.x + shape.size.width;
  const y1 = shape.position.y + shape.size.height;
  const rNorthWest = affineApply(affineFieldToTag, { x: x0, y: y0 });
  const rSouthEast = affineApply(affineFieldToTag, { x: x1, y: y1 });

  return <>
    <rect
      className="node-selection-box pointer-events-none"
      x={rNorthWest.x - boxMargin} y={rNorthWest.y - boxMargin}
      width={rSouthEast.x - rNorthWest.x + boxMargin * 2}
      height={rSouthEast.y - rNorthWest.y + boxMargin * 2}
      fill="transparent"
      strokeWidth={1.5}
    />
    <Reshapers {...props} rNorthWest={rNorthWest} rSouthEast={rSouthEast} />
    <LinkHandles {...props} rNorthWest={rNorthWest} rSouthEast={rSouthEast} scale={scale} />
  </>;
};
