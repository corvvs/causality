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
      {node.label && <p style={{
        ...(node.labelColor ? { color: node.labelColor } : {}),
      }}>{node.label}</p>}
    </div>
  </foreignObject>

};
