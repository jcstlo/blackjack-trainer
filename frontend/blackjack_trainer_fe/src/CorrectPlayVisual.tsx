import { Decision } from "./GameLogic";

export function CorrectPlayVisual(props: Decision) {
    let tailwindStyle = "mt-6 text-center font-bold";

    function createResultString(): string {
        let s = ""

        if (props.correct) {
            s += "Correct: ";
            tailwindStyle += " text-green-500";
        } else {
            s += "Incorrect: ";
            tailwindStyle += " text-red-500";
        }
        s += `You chose ${props.playerDecision}, and the correct play was ${props.correctDecision}.`

        return s;
    }

    let resultString = "";
    if (props.show) {
        resultString = createResultString();
    }

    return (
        <div className={tailwindStyle}>{resultString}</div>
    )
}
