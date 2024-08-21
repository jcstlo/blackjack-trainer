import { PlayerCount } from "./Counts";
import { getCardPath } from "./GameLogic";
import { PlayerHands } from "./PlayerHands";

interface PlayerHandsVisualProps {
    pHands: PlayerHands;
}

export function PlayerHandsVisual(props: PlayerHandsVisualProps) {
    const hands: JSX.Element[] = [];
    for (let i = 0; i < props.pHands.numHands; i++) {
        const hand: JSX.Element[] = [];
        let playerHandTitleStyle = "text-center text-2xl";
        if (props.pHands.focus === i) {
            playerHandTitleStyle += " font-bold text-blue-600";
        }
        hand.push(<p className={playerHandTitleStyle}>Player Hand {i+1}:</p>);
        hand.push(<PlayerCount playerHand={props.pHands.hands[i]}/>);

        const cards: JSX.Element[] = [];
        for (let j = 0; j < props.pHands.hands[i].length; j++) {
            const img_path = getCardPath(props.pHands.hands[i][j]);
            cards.push(<img src={img_path} className="drop-shadow-lg ml-1 mr-1"/>);
        }
        hand.push(<div className="flex justify-center">{cards}</div>);
        hands.push(<div className="mr-10 ml-10">{hand}</div>);
    }

    return (
        <div className="mt-7 mb-7 flex justify-center">{hands}</div>
    )
}
