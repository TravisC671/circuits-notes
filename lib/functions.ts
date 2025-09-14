import type { coordinate } from "./types";

export function getSvgPoint(
  svg: SVGSVGElement,
  event: PointerEvent
): coordinate {
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  let { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());

  return { x: x, y: y };
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

  t = Math.max(0, Math.min(1, t));

  return {
    x: start.x + t * dx,
    y: start.y + t * dy,
  };
}

export function snapToGrid(c: coordinate, scale: number): coordinate {
  return {
    x: Math.round(c.x / scale) * scale,
    y: Math.round(c.y / scale) * scale,
  };
}

export function generateUUID() {
  if ("randomUUID" in crypto) return crypto.randomUUID();
  // fallback (simplified version)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}