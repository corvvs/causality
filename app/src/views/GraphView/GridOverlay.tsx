import { useMemo } from "react";
import { affineApply, AffineMatrix } from "../../libs/affine";
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

const GridSubLayer: ComponentWithProps<{
  zoomLevel: number;
  getViewRect: () => Rectangle;
  scale: number;
  affineFieldToTag: AffineMatrix;
  affineTagToField: AffineMatrix;
}> = (props) => {
  const {
    scale,
    affineFieldToTag,
    affineTagToField,
  } = props;

  const grids: JSX.Element[] = [];
  const rect = props.getViewRect();

  const gridDistance = useMemo(() => gridD0 * Math.pow(4, -props.zoomLevel), [props.zoomLevel]);

  const viewR0Tag: Vector = rect.r0;
  const viewR1Tag: Vector = rect.r1;

  const viewR0Field = affineApply(affineTagToField, viewR0Tag);
  const viewR1Field = affineApply(affineTagToField, viewR1Tag);

  const xFieldMin = viewR0Field.x;
  const xFieldMax = viewR1Field.x;
  const yFieldMin = viewR0Field.y;
  const yFieldMax = viewR1Field.y;

  const nXGridMin = Math.ceil(xFieldMin / gridDistance);
  const nXGridMax = Math.floor(xFieldMax / gridDistance);
  const nYGridMin = Math.ceil(yFieldMin / gridDistance);
  const nYGridMax = Math.floor(yFieldMax / gridDistance);

  const opacity = useMemo(() => Math.min(opacityForZoomLevel(props.zoomLevel, scale), 1), [props.zoomLevel, scale]);

  for (let i = 0; i <= nXGridMax - nXGridMin; i++) {
    const n = nXGridMin + i;
    const vf: Vector = { x: n * gridDistance, y: 0 };
    const vt = affineApply(affineFieldToTag, vf);
    grids.push(<line className="causality"
      key={`x_${i}`}
      x1={vt.x} y1={viewR0Tag.y}
      x2={vt.x} y2={viewR1Tag.y}
    />)
  }

  for (let i = 0; i <= nYGridMax - nYGridMin; i++) {
    const n = nYGridMin + i;
    const vf: Vector = { x: 0, y: n * gridDistance };
    const vt = affineApply(affineFieldToTag, vf);
    grids.push(<line className="causality"
      key={`y_${i}`}
      x1={viewR0Tag.x} y1={vt.y}
      x2={viewR1Tag.x} y2={vt.y}
    />)
  }

  return (
    <g className="grid-overlay" opacity={opacity} strokeWidth={0.25}>
      {grids}
    </g>
  )
};

export const GridOverlay: ComponentWithProps<{
  getViewRect: () => Rectangle;
}> = (props) => {
  const {
    scale,
    affineFieldToTag,
    affineTagToField,
  } = useDisplay();
  const zoomLevelMin = useMemo(() => Math.floor(Math.log2(scale * gridD0 / gridDM) / 2 - 1), [scale]);
  const zoomLevelMax = useMemo(() => Math.floor(Math.log2(scale * gridD0 / gridDm) / 2), [scale]);
  return <>
    {
      Array.from({ length: zoomLevelMax - zoomLevelMin + 1 }, (_, i) => i + zoomLevelMin).map(zoomLevel => <GridSubLayer
        key={zoomLevel}
        zoomLevel={zoomLevel}
        getViewRect={props.getViewRect}
        scale={scale}
        affineFieldToTag={affineFieldToTag}
        affineTagToField={affineTagToField}
      />)
    }
  </>
}
