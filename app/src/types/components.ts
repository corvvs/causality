import { GraphShape, RectangleLikeNode } from ".";
import { MouseEventLike } from "../libs/touch";
import { DraggableMatter } from "../views/GraphView/types";

type HTMLProps<S extends Element> = React.DetailedHTMLProps<React.HTMLAttributes<S>, S>;
export type ComponentWithProps<T extends object, S extends Element = HTMLElement> = React.FC<T & HTMLProps<S>>;
export type DraggableProps = {
  mouseDownForDragging?: (e: MouseEventLike, matter: DraggableMatter) => void;
};
export type LinkingProps = {
  mouseDownForLinking?: (e: MouseEventLike, shape: RectangleLikeNode) => void;
};
export type SelectiveProps = {
  clickForSelection?: (e: MouseEventLike, node: GraphShape) => void;
};
