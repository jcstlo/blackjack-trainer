import { PlayerHands } from "../game-logic/PlayerHands";

interface DealerHandProps {
    hand: string[];
    faceDown: boolean;
}

interface MultipleHandsProps {
    pHands: PlayerHands;
}

export function DealerHand(props: DealerHandProps) {
    let cards: JSX.Element[] = [];

    if (props.faceDown) {
        cards.push(<li key={props.hand[0]}>{props.hand[0]}</li>)
        cards.push(<li key="facedown">(face-down)</li>)
    } else {
        cards = props.hand.map((card: string) => {
            return <li key={card}>{card}</li>;
        })
    }

    return (
        <>
            <p>Dealer hand:</p>
            <ul>
                {cards}
            </ul>
        </>
    )
}

export function MultiplePlayerHands(props: MultipleHandsProps) {
    const jsx: JSX.Element[] = [];
    for (let i = 0; i < props.pHands.numHands; i++) {
        // add hand title
        jsx.push(<><p>Player Hand {i}</p></>);

        // add hand list
        const temp: JSX.Element[] = [];
        for (let j = 0; j < props.pHands.hands[i].length; j++) {
            temp.push(<li key={props.pHands.hands[i][j]}>{props.pHands.hands[i][j]}</li>);
        }
        jsx.push(<ul>{temp}</ul>);
    }

    return (
        <>{jsx}</>
    )
}
