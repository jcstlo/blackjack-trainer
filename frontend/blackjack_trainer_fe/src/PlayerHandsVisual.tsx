import { PlayerCount } from "./Counts";
import { getCardPath } from "./GameLogic";
import { PlayerHands } from "./PlayerHands";

interface PlayerHandsVisualProps {
    pHands: PlayerHands;
}

export function PlayerHandsVisual(props: PlayerHandsVisualProps) {
    const jsx: JSX.Element[] = [];
    for (let i = 0; i < props.pHands.numHands; i++) {
        // add hand title
        jsx.push(<p className="text-2xl">Player Hand {i}</p>);

        // add hand list
        const temp: JSX.Element[] = [];
        for (let j = 0; j < props.pHands.hands[i].length; j++) {
            const img_path = getCardPath(props.pHands.hands[i][j]);
            temp.push(<img src={img_path}/>);
        }

        jsx.push(<PlayerCount playerHand={props.pHands.hands[i]}/>)
        jsx.push(<div className="flex">{temp}</div>);
    }

    return (
        <>{jsx}</>
    )
}
