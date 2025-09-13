import { create } from 'zustand'
import { coordinate, Tools, Wire } from './types';


type CanvasStore = {
  tool: Tools;
  wires: Wire[];
  setTool: (tool: Tools) => void;
  addWire: (wires: Wire) => void;
}

export const useCanvas = create<CanvasStore>((set) => ({
  tool: "Grab",
  wires: [],
  setTool: (tool) => set({ tool: tool }),
  addWire: (wires) => set((state) => ({wires: [...state.wires, wires]}))
}))