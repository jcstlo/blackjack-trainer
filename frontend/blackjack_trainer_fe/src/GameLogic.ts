import { HandCount } from "./HandCount";
import { PlayerHands } from "./PlayerHands";
import { calculateHandCount } from "./HandCount";

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

export interface Decision {
    show: boolean;
    playerDecision: string;
    correctDecision: string;
    correct: boolean;
    actionContext: string;
}

export interface DecisionCount {
    correctDecisionCount: number;
    totalDecisionCount: number;
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

export function checkWinner(playerCount: HandCount, dealerCount: HandCount): WinnerState {
    // figure out final hand count
    let truePlayerCount = 0;
    let trueDealerCount = 0;
    if (playerCount.softCount > 21) {
        truePlayerCount = playerCount.hardCount;
    } else {
        truePlayerCount = playerCount.softCount;
    }
    if (dealerCount.softCount > 21) {
        trueDealerCount = dealerCount.hardCount;
    } else {
        trueDealerCount = dealerCount.softCount;
    }

    // compare hands
    if (truePlayerCount > 21) {
        return WinnerState.DealerWinPlayerBust;
    } else if (trueDealerCount > 21) {
        return WinnerState.PlayerWinDealerBust;
    } else if (truePlayerCount > trueDealerCount) {
        return WinnerState.PlayerWin;
    } else if (truePlayerCount < trueDealerCount) {
        return WinnerState.DealerWin;
    } else {
        return WinnerState.Push;
    }
}

export function dealAnotherDealerCard(dealerCount: HandCount): boolean {
    // for most cases
    if (dealerCount.softCount < 17) {
        return true;
    }

    // for cases such as "4 + K + A" (softCount = 25 but hardCount = 15)
    if (dealerCount.softCount > 21 && dealerCount.hardCount < 17) {
        return true;
    }
    return false;
}

export function playersStillInGame(playerHands: PlayerHands): boolean {
    for (let i = 0; i < playerHands.numHands; i++) {
        const hand = playerHands.hands[i];
        const playerCount = calculateHandCount(hand);
        if (playerCount.hardCount <= 21) {
            return true;
        }
    }
    return false;
}
