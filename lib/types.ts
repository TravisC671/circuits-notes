export type coordinate = {
  x: number;
  y: number;
};

export type transform = {
  rot: number;
  pos: coordinate
};

export type Wire = {
  id: string;
  start: coordinate;
  end: coordinate;
};

export type CircuitComponentType = "Resistor" | "Power"

export type CircuitComponent = {
    type: CircuitComponentType;
    transform: transform
}

export type Tools = "Wire" | "FastWire" | "Screenshot" | "Resistor" | "Power";
