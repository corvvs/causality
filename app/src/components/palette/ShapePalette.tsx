import { CausalGraph, ColorValue, getLineWidth, GraphNode, GraphShape, hasLabel, hasLine, hasSegmentStyle, isCircleNode, isGraphSegment, isRectangleNode, LineAppearance, Rectangle } from "../../types";
import { ComponentWithProps } from "../../types/components";
import { InlineIcon } from "../InlineIcon";
import { LiaGripLinesVerticalSolid } from "react-icons/lia";
import { useDisplay } from "../../stores/display";
import { affineApply, AffineMatrix } from "../../libs/affine";
import { getPositionForTerminus } from "../../libs/segment";
import { useGraph } from "../../stores/graph";
import { Button, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ColorPicker } from "../ColorPicker";
import { FaA } from "react-icons/fa6";
import { TiDocumentText } from "react-icons/ti";



function getBoundingBoxForShape(shape: GraphShape, graph: CausalGraph, affineFieldToTag: AffineMatrix): Rectangle {
  if (isRectangleNode(shape)) {
    const r = shape.position;
    const size = shape.size;
    const r0 = affineApply(affineFieldToTag, r);
    const r1 = affineApply(affineFieldToTag, { x: r.x + size.width, y: r.y + size.height });
    return { r0, r1 };
  }
  if (isCircleNode(shape)) {
    const r = shape.position;
    const size = shape.size;
    const r0 = affineApply(affineFieldToTag, r);
    const r1 = affineApply(affineFieldToTag, { x: r.x + size.width, y: r.y + size.height });
    return { r0, r1 };
  }
  if (isGraphSegment(shape)) {
    const ps = getPositionForTerminus(shape, graph);
    const r0 = affineApply(affineFieldToTag, ps.starting);
    const r1 = affineApply(affineFieldToTag, ps.ending);
    return { r0, r1 };
  }
  return { r0: { x: 0, y: 0 }, r1: { x: 0, y: 0 } };
}

const TextInputSubPalette: ComponentWithProps<{
  shape: GraphShape;
}> = (props) => {
  const {
    shape,
  } = props;

  const {
    updateNodeDirectly,
  } = useGraph();

  return <Popover className="relative"
    onKeyDown={(e) => {
      e.stopPropagation();
    }}
  >
    <PopoverButton as="div">
      <Button className="canvas-palette-button p-1">
        <InlineIcon i={<TiDocumentText className="w-6 h-6" />} />
      </Button>
    </PopoverButton>
    <PopoverPanel anchor="bottom start" transition className="flex flex-col transition duration-200 ease-out data-[closed]:-translate-x-1 data-[closed]:opacity-0">
      <div className="edit-box">
        <input
          type="text"
          value={shape.label || ""}
          onChange={(e) => {
            updateNodeDirectly(shape.id, {
              label: e.target.value
            });
          }}
        />
      </div>
    </PopoverPanel>
  </Popover>
};

const TextColorSubPalette: ComponentWithProps<{
  shape: GraphShape;
}> = (props) => {
  const {
    shape,
  } = props;

  const {
    updateNodeDirectly,
  } = useGraph();
  return <Popover className="relative">
    <PopoverButton as="div">
      <Button className="canvas-palette-button p-1">
        <InlineIcon i={<FaA className="w-6 h-6" />} />
      </Button>
    </PopoverButton>
    <PopoverPanel anchor="bottom start" transition className="flex flex-col transition duration-200 ease-out data-[closed]:-translate-x-1 data-[closed]:opacity-0">
      {({ close }) => (
        <ColorPicker currentColor={shape.labelColor ?? null} setColor={(v: ColorValue | null) => {
          updateNodeDirectly(shape.id, {
            labelColor: v ?? undefined,
          });
          close();
        }} />
      )}
    </PopoverPanel>
  </Popover>
};

const LineSubPalette: ComponentWithProps<{
  shape: LineAppearance;
}> = (props) => {
  const {
    shape,
  } = props;


  const {
    updateNodeDirectly,
  } = useGraph();
  return <Popover className="relative">
    <PopoverButton as="div">
      <Button className="canvas-palette-button p-1">
        <InlineIcon i={<LiaGripLinesVerticalSolid className="w-6 h-6" />} />
      </Button>
    </PopoverButton>
    <PopoverPanel anchor="bottom start" transition className="flex flex-col transition duration-200 ease-out data-[closed]:-translate-x-1 data-[closed]:opacity-0">
      <div className="edit-box grid grid-rows-1 grid-flow-col gap-2">
        <label>Line Width</label>
        <input type="range" min={0.5} max={30} value={getLineWidth(shape)} onChange={(e) => {
          updateNodeDirectly(shape.id, {
            lineWidth: parseFloat(e.target.value),
          } as unknown as GraphNode);
        }} />
      </div>
    </PopoverPanel>
  </Popover>
};

/**
 * シェイプパレットコンポーネント
 * 
 * [表示位置の決定]
 * 以下の情報を使って決定する:
 * - キャンバスのバウンティングボックス
 * - シェイプのバウンティングボックス
 * 
 * 基本的には、シェイプの外、ちょっと上側に出す。
 * 無理そうならシェイプの外、ちょっと下側に出す。
 * 無理そうならシェイプの中、ビューポートの上に出す
 * 横位置は、シェイプの中心になるべく合わせる。
 */
export const ShapePalette: ComponentWithProps<{
  shape: GraphShape;
  getViewPort: () => Rectangle;
}> = (props) => {

  const { shape, getViewPort } = props;

  const {
    graph,
  } = useGraph();

  const {
    affineFieldToTag,
  } = useDisplay();


  const boudingBoxTag = getBoundingBoxForShape(shape, graph, affineFieldToTag);
  const viewPortTag = getViewPort();
  // 縦位置の決定
  const paletteYMargin = 40;
  const paletteHeight = 80; // 仮の数値
  const paletteY = (() => {
    if (viewPortTag.r0.y + paletteYMargin <= boudingBoxTag.r0.y - paletteHeight) {
      return { bottom: viewPortTag.r1.y - boudingBoxTag.r0.y + paletteYMargin };
    }
    if (boudingBoxTag.r1.y + paletteHeight <= viewPortTag.r1.y) {
      if (paletteYMargin > boudingBoxTag.r1.y + paletteHeight) {
        return null;
      }
      return { top: boudingBoxTag.r1.y + paletteYMargin };
    }
    return { top: viewPortTag.r0.y + paletteYMargin };
  })();
  // 横位置の決定(適当)
  const paletteX = {
    left: Math.min(Math.max(viewPortTag.r0.x, (boudingBoxTag.r0.x + boudingBoxTag.r1.x) / 2), viewPortTag.r1.x),
    transform: "translateX(-50%)",
  };

  if (!paletteY) { return null; }

  return <div
    className="shape-palette"
    style={{
      ...paletteX,
      ...paletteY,
    }}
    onMouseUp={(e) => {
      e.stopPropagation();
    }}
  >
    <div className="grid grid-rows-1 grid-flow-col gap-2 p-1">

      {hasLabel(shape) && <div title="Label"
      >
        <TextInputSubPalette shape={shape} />
      </div>}

      {hasLabel(shape) && <div title="Label"
        style={{
          color: shape.labelColor,
        }}
      >
        <TextColorSubPalette shape={shape} />
      </div>}

      {hasLine(shape) && <div title="Line"
      >
        <LineSubPalette shape={shape} />
      </div>}

      {hasSegmentStyle(shape) && <div title="SegmentStyle"
      >
        <InlineIcon i={<LiaGripLinesVerticalSolid className="w-6 h-6" />} />
      </div>}


    </div>
  </div >
}
