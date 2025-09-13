export type coordinate = {
    x: number, y: number
}

export type Wire = {start: coordinate, end: coordinate};

export type Tools = "Wire" | "Grab" | "Resistor"
