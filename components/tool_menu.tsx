import { JSX } from "react";
import { useCanvas } from "../lib/store";
import { Tools } from "../lib/types";

const tools: {name: Partial<Tools>, icon: JSX.Element}[] = [
  {
    name: "Grab",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24"
           strokeWidth="1.5"
           stroke="currentColor"
           className="h-5 w-5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 
            0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 
            3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 
            3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
        />
      </svg>
    ),
  },
  {
    name: "Wire",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg"
           className="h-5 w-5"
           fill="none"
           viewBox="0 0 24 24"
           stroke="currentColor">
        <line x1={4} y1={4} x2={20} y2={20} strokeLinecap="round" strokeWidth={2} />
      </svg>
    ),
  },
  {
    name: "Resistor",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg"
           className="h-5 w-5"
           fill="none"
           viewBox="0 0 19 19"
           stroke="currentColor">
        <path
          d="M0.821549 0.757095L3.9611 3.89665L8.36715 2.03619L4.88909 9.58718L12.4401 6.10912L8.87717 13.5753L16.8524 10.5215L14.6956 14.7147L17.7503 17.7694"
          strokeWidth="1.41795"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ToolMenu() {
  const tool = useCanvas((state) => state.tool);
  const setTool = useCanvas((state) => state.setTool);

  console.log(tool)

  return (
    <ul className="menu menu-horizontal bg-base-200 rounded-box absolute bottom-0">
      {tools.map(({ name, icon }) => (
        <li key={name}>
          <button
            onClick={() => setTool(name)}
            style={{backgroundColor: tool === name ? "var(--color-neutral)" : "transparent", color: tool === name ? "" : "var(--color-primary)"}}
          >
            {icon}
          </button>
        </li>
      ))}
    </ul>
  );
}
