import { Decision } from "./GameLogic";

export function CorrectPlayVisual(props: Decision) {
    function createResultString(): string {
        let s = ""

        if (props.correct) {
            s += "Correct: ";
        } else {
            s += "Incorrect: ";
        }
        s += `You chose ${props.playerDecision}, and the correct play was ${props.correctDecision}.`

        return s;
    }

    let resultString = "";
    if (props.show) {
        resultString = createResultString();
    }

    return (
        <div className="mt-6 text-center">{resultString}</div>
    )
}
