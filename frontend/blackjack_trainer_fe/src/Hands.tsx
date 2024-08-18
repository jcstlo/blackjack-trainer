import { PlayerHands } from "./PlayerHands";

interface HandProps {
    hand: string[];
}

interface MultipleHandsProps {
    pHands: PlayerHands;
}

export function DealerHand(props: HandProps) {
    const cards = props.hand.map((card: string) => {
        return <li>{card}</li>;
    })

    return (
        <>
            <p>Dealer hand:</p>
            <ul>
                {cards}
            </ul>
        </>
    )
}

export function PlayerHand(props: HandProps) {
    const cards = props.hand.map((card: string) => {
        return <li>{card}</li>;
    })

    return (
        <>
            <p>Player hand:</p>
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
            temp.push(<li>{props.pHands.hands[i][j]}</li>);
        }
        jsx.push(<ul>{temp}</ul>);
    }

    return (
        <>{jsx}</>
    )
}
