interface DealerHandVisualProps {
    hand: string[];
    faceDown: boolean;
}

function getCardPath(card: string): string {
    // returns "playing_cards/CARD_NAME.png"
    const path = "playing_cards/"
    const result = path.concat(card, ".png");
    return result;
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
            <p>Dealer hand:</p>
            {cards}
        </>
    )
}
