import { Vector } from "../types";

export type AffineMatrix = {
  xx: number;
  xy: number;
  xt: number;
  yx: number;
  yy: number;
  yt: number;
};

export function affineTranslation(translation: Vector): AffineMatrix {
  return {
    xx: 1,
    xy: 0,
    xt: translation.x,
    yx: 0,
    yy: 1,
    yt: translation.y,
  };
}

export function affineScale(scale: Vector): AffineMatrix {
  return {
    xx: scale.x,
    xy: 0,
    xt: 0,
    yx: 0,
    yy: scale.y,
    yt: 0,
  };
}

export function affineCompose(a: AffineMatrix, b: AffineMatrix): AffineMatrix {
  return {
    xx: a.xx * b.xx + a.xy * b.yx,
    xy: a.xx * b.xy + a.xy * b.yy,
    xt: a.xx * b.xt + a.xy * b.yt + a.xt,
    yx: a.yx * b.xx + a.yy * b.yx,
    yy: a.yx * b.xy + a.yy * b.yy,
    yt: a.yx * b.xt + a.yy * b.yt + a.yt,
  };
}

export function affineInvert(matrix: AffineMatrix): AffineMatrix {
  const det = matrix.xx * matrix.yy - matrix.xy * matrix.yx;
  return {
    xx: matrix.yy / det,
    xy: -matrix.xy / det,
    xt: (matrix.xy * matrix.yt - matrix.xt * matrix.yy) / det,
    yx: -matrix.yx / det,
    yy: matrix.xx / det,
    yt: (matrix.xt * matrix.yx - matrix.xx * matrix.yt) / det,
  };
}

export function affineApply(matrix: AffineMatrix, vector: Vector): Vector {
  return {
    x: matrix.xx * vector.x + matrix.xy * vector.y + matrix.xt,
    y: matrix.yx * vector.x + matrix.yy * vector.y + matrix.yt,
  };
}
