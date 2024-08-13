
function easeOutExpotential(t: number): number {
  return Math.min(1, 1 - Math.pow(2, -10 * t));
}

export const easing = {
  easeOutExpotential,
};
