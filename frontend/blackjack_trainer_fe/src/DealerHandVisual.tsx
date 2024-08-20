import { DealerCount } from "./Counts";
import { getCardPath } from "./GameLogic";

interface DealerHandVisualProps {
    hand: string[];
    faceDown: boolean;
}

export function DealerHandVisual(props: DealerHandVisualProps) {
    let cards: JSX.Element[] = [];

    if (props.faceDown) {
        const first_card = getCardPath(props.hand[0]);
        cards.push(<img src={first_card}/>);
        cards.push(<img src="playing_cards/facedown.png"/>);
    } else {
        cards = props.hand.map((card: string) => {
            const img_path = getCardPath(card);
            return <img src={img_path}/>;
        })
    }

    return (
        <>
            <p className="text-2xl">Dealer hand:</p>
            <DealerCount dealerHand={props.hand} faceDown={props.faceDown}/>
            <div className="flex">
                {cards}
            </div>
        </>
    )
}
