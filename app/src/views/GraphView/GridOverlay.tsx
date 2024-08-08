import { useMemo } from "react";
import { affineApply } from "../../libs/affine";
import { useDisplay } from "../../stores/display";
import { Rectangle, Vector } from "../../types";
import { ComponentWithProps } from "../../types/components";

const gridD0 = 100;
const gridDm = 40;
const gridDM = 200;

const distanceForZoomLevel = (zoomLevel: number) => {
  return gridD0 * Math.pow(4, -zoomLevel);
}

const opacityForZoomLevel = (zoomLevel: number, scale: number) => {
  return (distanceForZoomLevel(zoomLevel) * scale - gridDm) / (gridDM - gridDm);
}

export const GridSubLayer: ComponentWithProps<{
  zoomLevel: number;
  getViewRect: () => Rectangle;
}> = (props) => {
  const {
    scale,
    affineFieldToTag,
    affineTagToField,
  } = useDisplay();

  const grids: JSX.Element[] = [];
  const rect = props.getViewRect();

  const gridDistance = useMemo(() => gridD0 * Math.pow(4, -props.zoomLevel), [props.zoomLevel]);

  const rt0: Vector = rect.r0;
  const rt1: Vector = rect.r1;

  const rf0 = affineApply(affineTagToField, rt0);
  const rf1 = affineApply(affineTagToField, rt1);

  const xFMin = rf0.x;
  const xFMax = rf1.x;
  const yFMin = rf0.y;
  const yFMax = rf1.y;

  const nXGridMin = Math.ceil(xFMin / gridDistance);
  const nXGridMax = Math.floor(xFMax / gridDistance);
  const nYGridMin = Math.ceil(yFMin / gridDistance);
  const nYGridMax = Math.floor(yFMax / gridDistance);

  const opacity = useMemo(() => Math.min(opacityForZoomLevel(props.zoomLevel, scale), 1), [props.zoomLevel, scale]);

  for (let i = 0; i <= nXGridMax - nXGridMin; i++) {
    const n = nXGridMin + i;
    const vf: Vector = { x: n * gridDistance, y: 0 };
    const vt = affineApply(affineFieldToTag, vf);
    grids.push(<line
      key={`x_${i}`}
      x1={vt.x} y1={rt0.y}
      x2={vt.x} y2={rt1.y}
      stroke="white"
      strokeWidth="0.25"
      opacity={opacity}
    />)
  }

  for (let i = 0; i <= nYGridMax - nYGridMin; i++) {
    const n = nYGridMin + i;
    const vf: Vector = { x: 0, y: n * gridDistance };
    const vt = affineApply(affineFieldToTag, vf);
    grids.push(<line
      key={`y_${i}`}
      x1={rt0.x} y1={vt.y}
      x2={rt1.x} y2={vt.y}
      stroke="white"
      strokeWidth="0.25"
      opacity={opacity}
    />)
  }

  return (
    <>{grids}</>
  )
};

export const GridOverlay: ComponentWithProps<{
  getViewRect: () => Rectangle;
}> = (props) => {
  const {
    scale,
  } = useDisplay();
  const zoomLevelMin = useMemo(() => Math.floor(Math.log2(scale * gridD0 / gridDM) / 2 - 1), [scale]);
  const zoomLevelMax = useMemo(() => Math.floor(Math.log2(scale * gridD0 / gridDm) / 2), [scale]);
  return <g className="grid-overlay">
    {
      Array.from({ length: zoomLevelMax - zoomLevelMin + 1 }, (_, i) => i + zoomLevelMin).map(zoomLevel => <GridSubLayer
        key={zoomLevel}
        zoomLevel={zoomLevel}
        getViewRect={props.getViewRect}
      />)
    }
  </g>
}
