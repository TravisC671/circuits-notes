import {useEffect, useState } from "react";
import {
  closestPointOnLine,
  getSvgPoint,
  snapToGrid,
  generateUUID,
} from "../lib/functions";
import { useCircuitStore } from "../lib/store";
import type {
  CircuitComponent,
  coordinate,
  transform,
  Wire,
} from "../lib/types";

export default function Canvas() {
  const tool = useCircuitStore((state) => state.tool);
  const wires = useCircuitStore((state) => state.wires);
  const components = useCircuitStore((state) => state.components);
  const addWire = useCircuitStore((state) => state.addWire);
  const addComponent = useCircuitStore((state) => state.addComponent);
  const [hoveredWire, setHoveredWire] = useState<string>("");
  const [pendingWire, setPendingWire] = useState<coordinate | null>(null);
  const [hoverPos, setHoverPos] = useState<coordinate | null>(null);
  const [pendingComponent, setPendingComponent] = useState<transform | null>(
    null
  );

  let gridScale = 40;

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "touch") return;

    const svg = e.currentTarget;
    const point = getSvgPoint(svg, e.nativeEvent);

    switch (tool) {
      case "Wire":
        console.log(wires, length);

        if (pendingWire) {
          addWire({
            id: generateUUID(),
            start: pendingWire,
            end: snapToGrid(point, gridScale),
          });
          setPendingWire(null);
        } else {
          setPendingWire(snapToGrid(point, gridScale));
        }
        break;
      case "FastWire":
        if (pendingWire) {
          addWire({
            id: generateUUID(),
            start: pendingWire,
            end: snapToGrid(point, gridScale),
          });
          setPendingWire(snapToGrid(point, gridScale));
        } else {
          setPendingWire(snapToGrid(point, gridScale));
        }
        break;
      case "Resistor":
        if (pendingComponent) {
          addComponent({ type: "Resistor", transform: pendingComponent });
        }
        break;
      case "Power":
        if (pendingComponent) {
          addComponent({ type: "Power", transform: pendingComponent });
        }
        break;
    }
  };

  const HandleMouseMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const point = getSvgPoint(svg, e.nativeEvent);

    setHoverPos(point);

    switch (tool) {
      case "Power":
      case "Resistor":
        const wire = wires.find((el) => el.id === hoveredWire);

        if (!wire) {
          return setPendingComponent(null);
        }

        let linePoint = closestPointOnLine(wire.start, wire.end, point);

        const angleRad = Math.atan2(
          wire.end.y - wire.start.y,
          wire.end.x - wire.start.x
        );
        const angleDeg = (angleRad * 180) / Math.PI;

        setPendingComponent({ pos: linePoint, rot: angleDeg });
    }
  };

  useEffect(() => {
    setPendingWire(null);
    setHoverPos(null);
    setPendingComponent(null);
  }, [tool]);

  return (
    <>
      <svg
        id="canvas"
        className="w-dvw h-dvh absolute top-0"
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
        onPointerDown={handlePointerDown}
        onPointerMove={HandleMouseMove}
      >
        <style>
          {`:root { --wire-color: black; --circuit-bg: var(--color-base-100); }`}
        </style>
        <defs>
          <pattern
            id="bg"
            width={gridScale}
            height={gridScale}
            patternUnits="userSpaceOnUse"
          >
            <circle cx="0" cy="0" r="2" fill="#0b0f14" />
            <circle cx="0" cy={gridScale} r="2" fill="#0b0f14" />
            <circle cx={gridScale} cy="0" r="2" fill="#0b0f14" />
            <circle cx={gridScale} cy={gridScale} r="2" fill="#0b0f14" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#bg)" id="bgRect" />

        {wires.map((wire) => (
          <Wire key={wire.id} wire={wire} setHoveredWire={setHoveredWire} />
        ))}

        {components.map((component, index) => {
          switch (component.type) {
            case "Resistor":
              return <Resistor key={index} component={component} />;
            case "Power":
              return <Power key={index} component={component} />;
          }
        })}

        {/* Wire Hover*/}
        {hoverPos && pendingWire && (tool == "Wire" || tool == "FastWire") && (
          <line
            x1={pendingWire.x}
            y1={pendingWire.y}
            x2={hoverPos.x}
            y2={hoverPos.y}
            stroke="black"
            strokeLinecap="round"
            strokeWidth={4}
          ></line>
        )}

        {/* Reistor Hover*/}
        {pendingComponent && tool == "Resistor" && (
          <svg
            className="pointer-events-none"
            x={pendingComponent.pos.x - 25} // offset so resistor is centered
            y={pendingComponent.pos.y - 25}
            width={50}
            height={50}
            viewBox="0 0 200 200"
            fill="none"
          >
            <g transform={`rotate(${pendingComponent.rot}, 100, 100)`}>
              <path
                d="M0 100H37l15 37.5 24-66 24 66 23-66 29 66 12-38h36"
                stroke="white"
                strokeWidth="15"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        )}

        {/* Power Hover*/}
        {pendingComponent && tool == "Power" && (
          <svg
            className="pointer-events-none"
            x={pendingComponent.pos.x - 20} // offset so resistor is centered
            y={pendingComponent.pos.y - 20}
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2" />
          </svg>
        )}
      </svg>
    </>
  );
}

type WireProps = {
  wire: Wire;
  setHoveredWire: (id: string) => void;
};
export function Wire({ wire, setHoveredWire }: WireProps) {
  return (
    <>
      <line
        x1={wire.start.x}
        y1={wire.start.y}
        x2={wire.end.x}
        y2={wire.end.y}
        stroke="var(--wire-color)"
        strokeLinecap="round"
        strokeWidth={4}
      ></line>
      <line
        x1={wire.start.x}
        y1={wire.start.y}
        x2={wire.end.x}
        y2={wire.end.y}
        stroke="transparent"
        strokeLinecap="round"
        strokeWidth={30}
        onMouseEnter={() => setHoveredWire(wire.id)}
        onMouseLeave={() => setHoveredWire("")}
      ></line>
    </>
  );
}

type ResistorProps = {
  component: CircuitComponent;
};
export function Resistor({ component }: ResistorProps) {
  return (
    <svg
      className="pointer-events-none"
      x={component.transform.pos.x - 25} // offset so resistor is centered
      y={component.transform.pos.y - 25}
      width={50}
      height={50}
      viewBox="0 0 200 200"
      fill="none"
    >
      <g transform={`rotate(${component.transform.rot}, 100, 100)`}>
        <line
          x1={0}
          y1={100}
          x2={200}
          y2={100}
          strokeWidth={24}
          stroke="var(--circuit-bg)"
        />

        <path
          d="M0 100H37l15 37.5 24-66 24 66 23-66 29 66 12-38h36"
          stroke="var(--wire-color)"
          strokeWidth="15"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

type PowerProps = {
  component: CircuitComponent;
};
export function Power({ component }: PowerProps) {
  return (
    <svg
      className="pointer-events-none"
      x={component.transform.pos.x - 20} // offset so resistor is centered
      y={component.transform.pos.y - 20}
      width={40}
      height={40}
      viewBox="0 0 24 24"
      fill="none"
    >
      <g transform={`rotate(${component.transform.rot}, 12, 12)`}>
        <line
          x1={2}
          y1={12}
          x2={22}
          y2={12}
          strokeWidth={3}
          stroke="var(--circuit-bg)"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="var(--wire-color)"
          stroke-width="2"
        />
      </g>
    </svg>
  );
}
