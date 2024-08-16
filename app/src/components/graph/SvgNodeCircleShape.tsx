import { affineApply } from "../../libs/affine";
import { useDisplay } from "../../stores/display";
import { CircleNode, Size, Vector } from "../../types";
import { ComponentWithProps, DraggableProps, SelectiveProps } from "../../types/components";
import { SvgNodeInnterText } from "./SvgNodeInnterText";
import { CommonProps } from "./types";

export type ResizerType = "NW" | "NE" | "SE" | "SW" | "N" | "E" | "S" | "W";
type Resizer = {
  center: Vector;
  size: Size;
  type: ResizerType;
};

export const SvgNodeCircleSelectedShape: ComponentWithProps<{ node: CircleNode } & DraggableProps> = (props) => {
  const { node } = props;
  const {
    affineFieldToTag,
  } = useDisplay();

  const margin = node.shape.line.lineWidth;

  const x0 = node.position.x;
  const y0 = node.position.y;
  const x1 = node.position.x + node.size.width;
  const y1 = node.position.y + node.size.height;
  const r0 = affineApply(affineFieldToTag, { x: x0, y: y0 });
  const r1 = affineApply(affineFieldToTag, { x: x1, y: y1 });
  const rw = r1.x - r0.x;
  const rh = r1.y - r0.y;

  const handleSize = 12;

  const centers1: Resizer[] = [
    { type: "N", center: { x: (r0.x + r1.x) / 2, y: r0.y }, size: { width: rw, height: handleSize } },
    { type: "W", center: { x: r0.x, y: (r0.y + r1.y) / 2 }, size: { width: handleSize, height: rh } },
    { type: "S", center: { x: (r0.x + r1.x) / 2, y: r1.y }, size: { width: rw, height: handleSize } },
    { type: "E", center: { x: r1.x, y: (r0.y + r1.y) / 2 }, size: { width: handleSize, height: rh } },
  ];

  const centers2: Resizer[] = [
    { type: "NW", center: r0, size: { width: handleSize, height: handleSize } },
    { type: "SW", center: { x: r0.x, y: r1.y }, size: { width: handleSize, height: handleSize } },
    { type: "SE", center: r1, size: { width: handleSize, height: handleSize } },
    { type: "NE", center: { x: r1.x, y: r0.y }, size: { width: handleSize, height: handleSize } },
  ];

  const resizerCursor = {
    NW: "cursor-nw-resize",
    NE: "cursor-ne-resize",
    SE: "cursor-se-resize",
    SW: "cursor-sw-resize",
    N: "cursor-n-resize",
    E: "cursor-e-resize",
    S: "cursor-s-resize",
    W: "cursor-w-resize",
  };

  return <>
    <rect
      className="node-selection-box pointer-events-none"
      x={r0.x - margin} y={r0.y - margin}
      width={r1.x - r0.x + margin * 2}
      height={r1.y - r0.y + margin * 2}
      fill="transparent"
      strokeWidth={1.5}
    />

    {centers1.map((rs) => <rect
      key={rs.type}
      className={`resizer-edge ${resizerCursor[rs.type]} stroke-transparent fill-transparent`}
      x={rs.center.x - rs.size.width / 2} y={rs.center.y - rs.size.height / 2}
      width={rs.size.width} height={rs.size.height}
      onMouseDown={(e) => {
        if (!props.mouseDown) { return; }
        props.mouseDown(e, { target: "nodeResizer", nodeId: node.id, resizerType: rs.type });
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    />)}

    {centers2.map((rs) => <rect
      key={rs.type}
      className={`resizer-corner ${resizerCursor[rs.type]} stroke-1 hover:fill-blue-400`}
      x={rs.center.x - rs.size.width / 2} y={rs.center.y - rs.size.height / 2}
      width={rs.size.width} height={rs.size.height}
      onMouseDown={(e) => {
        if (!props.mouseDown) { return; }
        props.mouseDown(e, { target: "nodeResizer", nodeId: node.id, resizerType: rs.type });
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    />)}
  </>;
};

export const SvgNodeCircleShape: ComponentWithProps<CommonProps<CircleNode> & DraggableProps & SelectiveProps> = (props) => {
  const { node } = props;

  const basePosition = node.position;
  const baseTranslation = `translate(${basePosition.x}px, ${basePosition.y}px)`;
  return <g
    style={{
      transform: baseTranslation,
    }}
  >
    <ellipse
      cx={node.size.width / 2} cy={node.size.height / 2}
      rx={node.size.width / 2}
      ry={node.size.height / 2}
      fill="transparent"
      strokeWidth={node.shape.line.lineWidth}
      onClick={(e) => {
        if (!props.click) { return; }
        props.click(e, node);
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        if (!props.mouseDown) { return; }
        props.mouseDown(e, { target: "node", nodeId: node.id });
        e.stopPropagation();
      }}
    />

    <SvgNodeInnterText node={node} />
  </g>;
};
