import { CausalGraph, GraphShape, isCircleNode, isGraphSegment, isRectangleNode, Rectangle } from "../../types";
import { ComponentWithProps } from "../../types/components";
import { InlineIcon } from "../InlineIcon";
import { TiDocumentText } from "react-icons/ti";
import { LiaGripLinesVerticalSolid } from "react-icons/lia";
import { useDisplay } from "../../stores/display";
import { affineApply, AffineMatrix } from "../../libs/affine";
import { getPositionForTerminus } from "../../libs/segment";
import { useGraph } from "../../stores/graph";



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
      return { top: boudingBoxTag.r1.y + paletteYMargin };
    }
    return { top: viewPortTag.r0.y + paletteYMargin };
  })();
  const paletteX = Math.min(Math.max(viewPortTag.r0.x, (boudingBoxTag.r0.x + boudingBoxTag.r1.x) / 2), viewPortTag.r1.x);


  return <div
    className="shape-palette"
    style={{
      left: paletteX,
      ...paletteY,
      transform: "translateX(-50%)",
    }}
    onMouseUp={(e) => {
      e.stopPropagation();
    }}
  >
    <div className="grid grid-rows-1 grid-flow-col gap-2 p-1">

      <div title="Label"
        style={{
          color: shape.labelColor,
        }}
      >
        <InlineIcon i={<TiDocumentText className="w-6 h-6" />} />
      </div>

      <div title="Line"
      >
        <InlineIcon i={<LiaGripLinesVerticalSolid className="w-6 h-6" />} />
      </div>


    </div>
  </div >
}
