import { getHardTotalDecision, getPairSplitDecision, getSoftTotalDecision } from "./DecisionMap";
import { calculateHandCount, extractCardRank } from "./HandCount";
import { isSplitPossible } from "./PlayerHands";

export interface TrainingData {
    dealerUpCard: string;
    playerHand: string;
    map: string; // hardTotal, softTotal, pairSplit
    decision: string;
    correct: boolean;
}

// TODO
export function evaluateDecision(dealerUpCardUnformatted: string, playerHand: string[], playerDecision: string) {
    // TODO: create new TrainingData object
    // TODO: return the TrainingData object
    let correct: string = "";
    const playerCount = calculateHandCount(playerHand);
    const dealerUpCard = extractCardRank(dealerUpCardUnformatted);

    if (isSplitPossible(playerHand)) {
        console.log("Split map")
        // use pair split decision map
        const splitCard = extractCardRank(playerHand[0]);
        if (["10", "J", "Q", "K"].includes(splitCard)) {
            correct = getPairSplitDecision("T", dealerUpCard);
        } else {
            correct = getPairSplitDecision(splitCard, dealerUpCard);
        }
    } else if (playerCount.softCount > playerCount.hardCount && playerCount.softCount <= 21) {
        console.log("soft count map")
        // use soft count decision map
        correct = getSoftTotalDecision(playerCount.softCount-11, dealerUpCard);
    } else if (playerCount.hardCount <= 21) {
        console.log("Hard count map")
        // use hard count decision map
        correct = getHardTotalDecision(playerCount.hardCount, dealerUpCard);
    }

    console.log(`You chose: ${playerDecision}`);
    console.log(`Correct play was: ${correct}`);
}
