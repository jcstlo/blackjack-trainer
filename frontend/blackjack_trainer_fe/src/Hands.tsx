export function DealerHand() {
    const TEMPORARY_ARRAY: string[] = ["a", "b", "c"];
    const cards = TEMPORARY_ARRAY.map((card: string) => {
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

export function PlayerHand() {
    const TEMPORARY_ARRAY: string[] = ["d", "e", "f"];
    const cards = TEMPORARY_ARRAY.map((card: string) => {
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
