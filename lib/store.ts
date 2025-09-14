import { create } from "zustand";
import type { CircuitComponent, coordinate, Tools, Wire } from "./types";

type CircuitStore = {
  tool: Tools;
  wires: Wire[];
  components: CircuitComponent[];
  setTool: (tool: Tools) => void;
  addWire: (wires: Wire) => void;
  addComponent: (component: CircuitComponent) => void;
  clear: () => void;
};

export const useCircuitStore = create<CircuitStore>((set) => ({
  tool: "Wire",
  wires: [],
  components: [],
  setTool: (tool) => set({ tool: tool }),
  addWire: (wire) => set((state) => ({ wires: [...state.wires, wire] })),
  addComponent: (component) =>
    set((state) => ({ components: [...state.components, component] })),
  clear: () => set({ wires: [], components: [] }),
}));
