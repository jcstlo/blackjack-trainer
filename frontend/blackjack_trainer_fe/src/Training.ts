export interface TrainingData {
    dealerUpCard: string;
    playerHand: string;
    map: string; // hardTotal, softTotal, pairSplit
    decision: string;
    correct: boolean;
}

// TODO
// export function evaluateDecision(dealerCount: string, playerCount: string, playerDecision: string) {
//     // check a hashmap for the correct decision
//     // create new TrainingData object
//     // return the TrainingData object
// }
