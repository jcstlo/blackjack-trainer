export enum GameState {
    Idle,
    GetChoice,
    GetFirstChoice
}

export enum WinnerState {
    DealerWinPlayerBust,
    PlayerWinDealerBust,
    PlayerWin,
    DealerWin,
    Push
}

export function shuffleDeck(deck: string[]): string[] {
    // create copy of passed-in array
    const shuffled = [...deck];

    // shuffle array using Fisher-Yates (Knuth) Shuffle
    let currIndex = shuffled.length;
    while (currIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currIndex);
        currIndex--;
        [shuffled[currIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currIndex]];
    }

    return shuffled;
}

export function drawCard(deck: string[]): string {
    // pop card from top of deck (last index = top of deck)
    const card = deck.pop();
    if (typeof card === "string") {
        return card;
    } else {
        return "NO_MORE_CARDS" // TODO: handle this usecase (very unlikely to get here though)
    }
}

export function getCardPath(card: string): string {
    // returns "playing_cards/CARD_NAME.png"
    const path = "playing_cards/"
    const result = path.concat(card, ".png");
    return result;
}
