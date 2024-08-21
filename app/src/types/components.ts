import { GraphShape, RectangleLikeNode } from ".";
import { DraggableMatter } from "../views/GraphView/types";

type HTMLProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
export type ComponentWithProps<T extends object> = React.FC<T & HTMLProps>;
export type DraggableProps = {
  mouseDownForDragging?: (e: React.MouseEvent<SVGElement>, matter: DraggableMatter) => void;
};
export type LinkingProps = {
  mouseDownForLinking?: (e: React.MouseEvent<SVGElement>, shape: RectangleLikeNode) => void;
};
export type SelectiveProps = {
  clickForSelection?: (e: React.MouseEvent<SVGElement>, node: GraphShape) => void;
};
