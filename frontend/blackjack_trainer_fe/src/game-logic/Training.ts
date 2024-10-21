import { getHardTotalDecision, getPairSplitDecision, getSoftTotalDecision } from "./DecisionMap";
import { Decision, DecisionCount, GameState } from "./GameLogic";
import { calculateHandCount, extractCardRank } from "./HandCount";
import { isSplitPossible } from "./PlayerHands";

export interface TrainingData {
    dealerUpCard: string;
    playerHand: string;
    map: string; // hardTotal, softTotal, pairSplit
    decision: string;
    correct: boolean;
}

function translateCorrectDecision(decision: string, gameState: GameState): string {
    switch (decision) {
        case "H": return "Hit";
        case "S": return "Stand";
        case "D": {
            console.log("Went into Double/Hit!")
            if (gameState === GameState.GetFirstChoice) {
                return "Double";
            } else {
                return "Hit";
            }
        }
        case "DS": {
            console.log("Went into Double/Stand!")
            if (gameState === GameState.GetFirstChoice) {
                return "Double";
            } else {
                return "Stand";
            }
        }
        // case "N": return "Don't Split";
        case "Y": return "Split";
        // case "YN": return "Split only if DAS is offered";
        default: return "INVALID";
    }
}

export function evaluateDecision(dealerUpCardUnformatted: string, playerHand: string[], playerDecision: string, gameState: GameState): Decision {
    // ASSUMPTIONS:
    //   for YN: DAS IS NOT OFFERED
    //   for DS: DOUBLE IS ALLOWED

    let correct: string = "";
    let actionContextPlayerHand: string = "";
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
        actionContextPlayerHand = `${splitCard},${splitCard}`;
    }

    if (!isSplitPossible(playerHand) || correct !== "Y") { // if the correct play is to NOT split, then use soft/hard decision map
        if (playerCount.softCount > playerCount.hardCount && playerCount.softCount <= 21) {
            // use soft count decision map
            correct = getSoftTotalDecision(playerCount.softCount-11, dealerUpCard);
            if (actionContextPlayerHand === "") {
                actionContextPlayerHand = `S${playerCount.softCount}`;
            }
        } else if (playerCount.hardCount <= 21) {
            // use hard count decision map
            correct = getHardTotalDecision(playerCount.hardCount, dealerUpCard);
            if (actionContextPlayerHand === "") {
                actionContextPlayerHand = `${playerCount.hardCount}`;
            }
        }
    }

    correct = translateCorrectDecision(correct, gameState);

    let actionContextDealerUpcard = "";
    if (["J", "Q", "K"].includes(dealerUpCard)) {
        actionContextDealerUpcard = "10";
    } else {
        actionContextDealerUpcard = dealerUpCard;
    }

    const result: Decision = {
        show: true,
        playerDecision: playerDecision,
        correctDecision: correct,
        correct: (playerDecision === correct),
        actionContext: `${actionContextPlayerHand} against ${actionContextDealerUpcard}`
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
