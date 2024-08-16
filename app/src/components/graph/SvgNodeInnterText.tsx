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
      <p style={{
        color: node.labelColor,
      }}>{node.id}</p>
      {node.label && <p>{node.label}</p>}
    </div>
  </foreignObject>

};
