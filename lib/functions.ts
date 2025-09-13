import { coordinate } from "./types";

export function getSvgPoint(svg: SVGSVGElement, event: PointerEvent) {
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}

export function closestPointOnLine(
  start: coordinate,
  end: coordinate,
  point: coordinate
): coordinate {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared == 0) return start;

  let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;

  t = Math.max(0, Math.min(1, t))

  return {
    x: start.x + t * dx,
    y: start.y + t * dy
  }
}
