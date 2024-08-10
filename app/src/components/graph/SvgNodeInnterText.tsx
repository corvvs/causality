import { sprintf } from "sprintf-js";
import { RectangleNode } from "../../types";
import { ComponentWithProps } from "../../types/components";

export const SvgNodeInnterText: ComponentWithProps<{ node: RectangleNode }> = (props) => {
  const { node } = props;
  return <foreignObject
    x="0" y="0"
    width={node.size.width}
    height={node.size.height}
    style={{
      pointerEvents: "none"
    }}
  >
    <div
      className="w-full h-full flex flex-col justify-center items-center text-xs"
    >
      <p>{sprintf("(%1.2f, %1.2f)", node.position.x, node.position.y)}</p>
      <p>{node.id}</p>
    </div>
  </foreignObject>

};
