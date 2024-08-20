import { getCardPath } from "./GameLogic";
import { PlayerHands } from "./PlayerHands";

interface PlayerHandsVisualProps {
    pHands: PlayerHands;
}

export function PlayerHandsVisual(props: PlayerHandsVisualProps) {
    const jsx: JSX.Element[] = [];
    for (let i = 0; i < props.pHands.numHands; i++) {
        // add hand title
        jsx.push(<p>Player Hand {i}</p>);

        // add hand list
        for (let j = 0; j < props.pHands.hands[i].length; j++) {
            const img_path = getCardPath(props.pHands.hands[i][j]);
            jsx.push(<img src={img_path}/>);
        }
    }

    return (
        <>{jsx}</>
    )
}
