/**
 * Adapted from Paperlab, Copyright 2026 Noor Mtir, Apache-2.0.
 * Source: NourMtir0722/Paperlab@41914833cb9ae12b32a8cbbdee4723f5b12158af
 * packages/paperlab/src/deformers/roll.ts and behaviors/unroll.ts.
 * Modifications (2026-10-16): plain JS, no schema/React wrapper; expose the
 * existing CPU mapping for a front-facing single scroll. Original winding
 * math retained. The original's arc-length approximation is not a cloth sim.
 * Full LICENSE and NOTICE are distributed in ../licenses/.
 */
const TAU = Math.PI * 2;
const MIN_RADIUS_FRACTION = 0.08;

export function windAngle(s, r0, k) {
  if (k <= 0) return s / r0;
  const rMin = r0 * MIN_RADIUS_FRACTION;
  const thetaFloor = (r0 - rMin) / k;
  const sFloor = r0 * thetaFloor - k * thetaFloor * thetaFloor / 2;
  if (s >= sFloor) return thetaFloor + (s - sFloor) / rMin;
  return 2 * s / (r0 + Math.sqrt(r0 * r0 - 2 * k * s));
}

export function rollRadius(length, core, thickness) {
  return Math.sqrt(core * core + Math.max(0, length) * thickness / Math.PI);
}

export function rollPoint(x, y, z, boundary, radius, thickness) {
  const s = -y - boundary;
  if (s <= 0) return [x, y, z];
  const k = thickness / TAU;
  const theta = windAngle(s, radius, k);
  const r = Math.max(radius - k * theta, radius * MIN_RADIUS_FRACTION) - z;
  return [x, -(boundary + r * Math.sin(theta)), radius - r * Math.cos(theta)];
}
