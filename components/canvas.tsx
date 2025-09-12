import type { coordinate } from "../lib/types"


export default function Canvas() {

    return (
        < svg
            width="99vw"
            height="99vh"
            className="border border-gray-400"
        >
            <Wire start={{x: 0, y:0}} end={{x: 100, y: 100}}/>

        </svg >)
}

type WireProps = {
    start: coordinate,
    end: coordinate
}
export function Wire({ start, end }: WireProps) {
    return (<line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="black" strokeWidth={2}></line>)
}