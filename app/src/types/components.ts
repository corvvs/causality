import { GraphShape, RectangleLikeNode } from ".";
import { MouseEventLike } from "../libs/touch";
import { DraggableMatter } from "../views/GraphView/types";

type HTMLProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
export type ComponentWithProps<T extends object> = React.FC<T & HTMLProps>;
export type DraggableProps = {
  mouseDownForDragging?: (e: MouseEventLike, matter: DraggableMatter) => void;
};
export type LinkingProps = {
  mouseDownForLinking?: (e: MouseEventLike, shape: RectangleLikeNode) => void;
};
export type SelectiveProps = {
  clickForSelection?: (e: MouseEventLike, node: GraphShape) => void;
};
