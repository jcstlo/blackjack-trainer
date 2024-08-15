interface HandProps {
    hand: string[];
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
