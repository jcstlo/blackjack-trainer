import { extractCardRank } from "./HandCount";

export interface PlayerHands {
    hands: string[][];
    focus: number;
    numHands: number;
}

function isSplitPossible(hand: string[]): boolean {
    if (hand.length !== 2) {
        return false;
    }

    const card1rank = extractCardRank(hand[0]);
    const card2rank = extractCardRank(hand[1]);
    return (card1rank === card2rank);
}

export function splitHand(playerHands: PlayerHands): boolean {
    const numHandToSplit = playerHands.focus;
    const handToSplit = playerHands.hands[numHandToSplit];

    if (!isSplitPossible(handToSplit)) {
        return false;
    }

    const newHand1: string[] = [handToSplit[0]];
    const newHand2: string[] = [handToSplit[1]];
    playerHands.hands.splice(numHandToSplit, 1, newHand1, newHand2);
    playerHands.numHands += 1;
    return true;
}

export function addCardToHand(playerHands: PlayerHands, card: string): void {
    const numHandToAddCard = playerHands.focus;
    playerHands.hands[numHandToAddCard].push(card);
}

export function clonePlayerHands(playerHands: PlayerHands): PlayerHands {
    const newPlayerHands = structuredClone(playerHands);
    return newPlayerHands;
}

export function newPlayerHand(): PlayerHands {
    const newHand: PlayerHands = {
        hands: [[]],
        focus: 0,
        numHands: 1
    };

    return newHand;
}
