import { GraphNode } from ".";

type HTMLProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
export type ComponentWithProps<T extends object> = React.FC<T & HTMLProps>;
export type DraggableProps = {
  mouseDown?: (e: React.MouseEvent<SVGElement>, node: GraphNode) => void;
  mouseUp?: (e: React.MouseEvent<SVGElement>, node: GraphNode) => void;
  mouseMove?: (e: React.MouseEvent<SVGElement>, node: GraphNode) => void;
};
