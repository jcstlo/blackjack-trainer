import { DecisionCount } from "../game-logic/GameLogic";

export function DecisionCountVisual(props: DecisionCount) {
    const correctDecisionString = `Correct decisions: ${props.correctDecisionCount}`;
    const totalDecisionString = `Total decisions: ${props.totalDecisionCount}`;
    const percentageString = `Percentage: ${(props.correctDecisionCount / props.totalDecisionCount * 100).toFixed(2)}%`;

    return (
        <>
            <div className="text-center">{props.totalDecisionCount > 0 ? correctDecisionString : ""}</div>
            <div className="text-center">{props.totalDecisionCount > 0 ? totalDecisionString : ""}</div>
            <div className="text-center">{props.totalDecisionCount > 0 ? percentageString : ""}</div>
        </>
    )
}
