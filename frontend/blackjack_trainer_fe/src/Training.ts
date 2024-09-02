import { getHardTotalDecision, getPairSplitDecision, getSoftTotalDecision } from "./DecisionMap";
import { Decision, DecisionCount } from "./GameLogic";
import { calculateHandCount, extractCardRank } from "./HandCount";
import { isSplitPossible } from "./PlayerHands";

export interface TrainingData {
    dealerUpCard: string;
    playerHand: string;
    map: string; // hardTotal, softTotal, pairSplit
    decision: string;
    correct: boolean;
}

function translateCorrectDecision(decision: string): string {
    // TODO: need to remove everything other than Hit, Stand, Double, Split
    switch (decision) {
        case "H": return "Hit";
        case "S": return "Stand";
        case "D": return "Double";
        case "DS": return "Double/Stand";
        case "N": return "Don't Split";
        case "Y": return "Split";
        case "YN": return "Split only if DAS is offered";
        default: return "INVALID";
    }
}

export function evaluateDecision(dealerUpCardUnformatted: string, playerHand: string[], playerDecision: string): Decision {
    let correct: string = "";
    const playerCount = calculateHandCount(playerHand);
    const dealerUpCard = extractCardRank(dealerUpCardUnformatted);

    if (isSplitPossible(playerHand)) {
        // use pair split decision map
        const splitCard = extractCardRank(playerHand[0]);
        if (["10", "J", "Q", "K"].includes(splitCard)) {
            correct = getPairSplitDecision("T", dealerUpCard);
        } else {
            correct = getPairSplitDecision(splitCard, dealerUpCard);
        }
    } else if (playerCount.softCount > playerCount.hardCount && playerCount.softCount <= 21) {
        // use soft count decision map
        correct = getSoftTotalDecision(playerCount.softCount-11, dealerUpCard);
    } else if (playerCount.hardCount <= 21) {
        // use hard count decision map
        correct = getHardTotalDecision(playerCount.hardCount, dealerUpCard);
    }
    correct = translateCorrectDecision(correct);

    const result: Decision = {
        show: true,
        playerDecision: playerDecision,
        correctDecision: correct,
        correct: (playerDecision === correct)
    }
    return result;
}

export function evaluateDecisionCount(newDecision: Decision, currentDecisionCount: DecisionCount): DecisionCount {
    const newDecisionCount = structuredClone(currentDecisionCount);

    if (newDecision.correct) {
        newDecisionCount.correctDecisionCount += 1;
    }
    newDecisionCount.totalDecisionCount += 1;

    return newDecisionCount;
}
