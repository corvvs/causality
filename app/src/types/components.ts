import { GraphShape } from ".";
import { DraggableMatter } from "../views/GraphView/types";

type HTMLProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
export type ComponentWithProps<T extends object> = React.FC<T & HTMLProps>;
export type DraggableProps = {
  mouseDown?: (e: React.MouseEvent<SVGElement>, matter: DraggableMatter) => void;
};
export type SelectiveProps = {
  click?: (e: React.MouseEvent<SVGElement>, node: GraphShape) => void;
};
