import type { JSX } from "react";
import { useCircuitStore } from "../lib/store";
import type { Tools } from "../lib/types";

const tools: { name: Tools; icon: JSX.Element }[] = [
  {
    name: "Wire",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <line
          x1={4}
          y1={4}
          x2={20}
          y2={20}
          strokeLinecap="round"
          strokeWidth={2}
        />
      </svg>
    ),
  },
  {
    name: "FastWire",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.8528 0.592031C24.2411 0.816353 24.374 1.3129 24.1498 1.70121L15.6218 16.4704C15.3942 16.8647 14.8486 16.9252 14.4775 
          16.6613V16.6613C14.1575 16.4337 14.0179 16.0006 14.2142 15.6605L22.7433 0.889101C22.9676 0.500638 23.4644 0.367622 23.8528 
          0.592031V0.592031ZM9.94684 15.4775C10.1538 15.8359 9.98684 16.2938 9.63507 16.5119V16.5119C9.26569 16.741 8.75694 16.665 8.53963 
          16.2886L0.117878 1.7012C-0.106306 1.31289 0.0266553 0.816367 0.41489 0.592053V0.592053C0.803307 0.367635 1.30011 0.50067 1.5244 
          0.88916L9.94684 15.4775Z"
          fill="currentColor"
        />
        <circle
          cx="11.944"
          cy="20.2396"
          r="2.76044"
          stroke="currentColor"
          stroke-width="1.29903"
        />
      </svg>
    ),
  },
  {
    name: "Resistor",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 19 19"
        stroke="currentColor"
      >
        <path
          d="M0.821549 0.757095L3.9611 3.89665L8.36715 2.03619L4.88909 9.58718L12.4401 6.10912L8.87717 13.5753L16.8524 10.5215L14.6956 14.7147L17.7503 17.7694"
          strokeWidth="1.41795"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Power",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" />
      </svg>
    ),
  },
];

export default function ToolMenu() {
  const tool = useCircuitStore((state) => state.tool);
  const setTool = useCircuitStore((state) => state.setTool);
  const clear = useCircuitStore((state) => state.clear);

  const exportCanvas = () => {
    setTool('Screenshot')

    const svg = document.getElementById("canvas");
    if (!svg) return;

    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;

    const bgRect = clonedSvg.querySelector("#bgRect");
    if (bgRect) {
      bgRect.remove();
    }

    const styleElement = clonedSvg.querySelector("style");
    if (styleElement) {
      styleElement.textContent =
        styleElement.textContent = `:root { --wire-color: black; --circuit-bg: white; }`;
    }

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const upres = 1.5;
      const viewBox = clonedSvg.viewBox.baseVal;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = viewBox.width * dpr * upres;
      canvas.height = viewBox.height * dpr * upres;

      ctx?.scale(dpr * upres, dpr * upres);

      ctx?.drawImage(img, 0, 0, viewBox.width, viewBox.height);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "export.png";
      link.click();

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  console.log(tool);

  return (
    <div className="absolute left-2 top-2 flex flex-col gap-2">
      <ul className="menu menu-vertical bg-base-200 rounded-box">
        {tools.map(({ name, icon }) => (
          <li key={name}>
            <button
              onClick={() => setTool(name)}
              style={{
                backgroundColor:
                  tool === name ? "var(--color-neutral)" : "transparent",
                color: tool === name ? "" : "var(--color-primary)",
              }}
            >
              {icon}
            </button>
          </li>
        ))}
      </ul>
      <ul className="menu menu-vertical bg-base-200 rounded-box gap-1">
        <li>
          <button className="btn btn-soft btn-primary" onClick={exportCanvas}>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
          </button>
        </li>
        <li>
          <button className="btn btn-soft btn-primary" onClick={clear}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              className="h-5 w-5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  );
}
