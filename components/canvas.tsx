import { MouseEventHandler, useEffect, useRef, useState } from "react";
import type { coordinate, Tools, Wire } from "../lib/types";
import { useCanvas } from "../lib/store";
import { closestPointOnLine, getSvgPoint } from "../lib/functions";

export default function Canvas() {
  const [unsetWire, setUnsetWire] = useState<Wire | null>(null);
  const [wireHover, setWireHover] = useState<Wire | null>(null);
  const [initialPos, setInitialPos] = useState<coordinate | null>(null);
  const [hoverPos, setHoverPos] = useState<coordinate | null>(null);
  const tool = useCanvas((state) => state.tool);
  const wires = useCanvas((state) => state.wires);
  const addWire = useCanvas((state) => state.addWire);
  const svgRef = useRef<SVGSVGElement>(null);

  let gridScale = 40;

  const onMouseMove = (e) => {
    const svg = e.currentTarget;
    const { x, y } = getSvgPoint(svg, e.nativeEvent);

    if (initialPos != null) {
      setUnsetWire({ start: initialPos, end: { x: x, y: y } });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "touch") return;

    const svg = e.currentTarget;
    const { x, y } = getSvgPoint(svg, e.nativeEvent);

    let current: coordinate = {
      x: Math.round(x / gridScale) * gridScale,
      y: Math.round(y / gridScale) * gridScale,
    };
    console.log(current, unsetWire);
    if (initialPos == null) {
      setInitialPos(current);
    } else {
      addWire({ start: initialPos, end: current });
      setInitialPos(null);
      setUnsetWire(null);
    }
  };

  return (
    <svg
      ref={svgRef}
      className="w-screen h-screen"
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      //   onClick={onCLick}
      onMouseMove={onMouseMove}
      onPointerDown={handlePointerDown}
    >
      <defs>
        <pattern
          id="bg"
          width={gridScale}
          height={gridScale}
          patternUnits="userSpaceOnUse"
        >
          <circle cx="0" cy="0" r="2" fill="black" />
          <circle cx="0" cy={gridScale} r="2" fill="black" />
          <circle cx={gridScale} cy="0" r="2" fill="black" />
          <circle cx={gridScale} cy={gridScale} r="2" fill="black" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg)" />

      {wires.map((wire, index) => (
        <Wire
          key={index}
          start={wire.start}
          end={wire.end}
          setHoverPos={setHoverPos}
          setWireHover={setWireHover}
        />
      ))}

      {svgRef.current && (
        <ResistorHover
          wire={wireHover}
          tool={tool}
          svgRef={svgRef as React.RefObject<SVGSVGElement>}
        />
      )}

      {/* {unsetWire && (
        <Wire start={unsetWire.start} end={unsetWire.end} isUnset />
      )} */}
    </svg>
  );
}

type WireProps = {
  start: coordinate;
  end: coordinate;
  setWireHover: (wire: Wire) => void;
  setHoverPos: (pos: coordinate) => void;
  isUnset?: boolean;
};
export function Wire({
  start,
  end,
  isUnset,
  setWireHover,
  setHoverPos,
}: WireProps) {
  const [isHovered, setHovered] = useState(false);
  const onMouseEnter = (e) => {
    const svg = e.currentTarget.ownerSVGElement!;
    const { x, y } = getSvgPoint(svg, e.nativeEvent);
    console.log(svg);
    setHovered(true);
    setWireHover({ start: start, end: end });
    setHoverPos({ x: x, y: y });
  };

  return (
    <>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="white"
        strokeLinecap="round"
        strokeWidth={8}
        opacity={isHovered && !isUnset ? 0.4 : 0}
      ></line>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="black"
        strokeLinecap="round"
        strokeWidth={4}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setHovered(false)}
      ></line>
    </>
  );
}

type ResistorHoverProps = {
  wire: Wire | null;
  tool: Tools;
  svgRef: React.RefObject<SVGSVGElement>;
};

export function ResistorHover({ wire, tool, svgRef }: ResistorHoverProps) {
  const [snappedPos, setSnappedPos] = useState<coordinate | null>(null);

  if (tool !== "Resistor") return null;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg ) return;

    function handleMove(e: PointerEvent) {
      if (wire == null) return

      const mouse = getSvgPoint(svg, e); // convert to SVG space
      const snapped = closestPointOnLine(wire.start, wire.end, mouse);
      setSnappedPos(snapped);
    }

    svg.addEventListener("pointermove", handleMove);
    return () => svg.removeEventListener("pointermove", handleMove);
  }, [wire, svgRef]);

  if (!snappedPos) return null;

  return (
    <svg
      className="pointer-events-none"
      x={snappedPos.x - 25} // offset so resistor is centered
      y={snappedPos.y - 10}
      width={40 * 1.25}
      height={15.6 * 1.25}
      viewBox="0 0 200 78"
      fill="none"
    >
      <path
        d="M0 34.5H37L52 72L76 6L100 72L123 6L152 72L164 34H200"
        stroke="white"
        strokeWidth="12"
        strokeLinejoin="round"
      />
    </svg>
  );
}
