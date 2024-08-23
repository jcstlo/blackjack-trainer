const hardTotalDecisionMap: string[][] = [
//    2    3    4    5    6    7    8    9   10    A    <-- Dealer upcard
    ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // hardTotal = 17,18,19,20,21
    ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // hardTotal = 16
    ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // hardTotal = 15
    ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // hardTotal = 14
    ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // hardTotal = 13
    ["H", "H", "S", "S", "S", "H", "H", "H", "H", "H"], // hardTotal = 12
    ["D", "D", "D", "D", "D", "D", "D", "D", "D", "D"], // hardTotal = 11
    ["D", "D", "D", "D", "D", "D", "D", "D", "H", "H"], // hardTotal = 10
    ["H", "D", "D", "D", "D", "H", "H", "H", "H", "H"], // hardTotal = 9
    ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"], // hardTotal = 8,7,6,5,4,3,2
];

export const softTotalDecisionMap: string[][] = [
//    2     3     4     5     6     7    8    9   10    A    <-- Dealer upcard
    ["S",  "S",  "S",  "S",  "S",  "S", "S", "S", "S", "S"], // softTotal = A,9
    ["S",  "S",  "S",  "S",  "DS", "S", "S", "S", "S", "S"], // softTotal = A,8
    ["DS", "DS", "DS", "DS", "DS", "S", "S", "H", "H", "H"], // softTotal = A,7
    ["H",  "DH", "DH", "DH", "DH", "H", "H", "H", "H", "H"], // softTotal = A,6
    ["H",  "H",  "DH", "DH", "DH", "H", "H", "H", "H", "H"], // softTotal = A,5
    ["H",  "H",  "DH", "DH", "DH", "H", "H", "H", "H", "H"], // softTotal = A,4
    ["H",  "H",  "H",  "DH", "DH", "H", "H", "H", "H", "H"], // softTotal = A,3
    ["H",  "H",  "H",  "DH", "DH", "H", "H", "H", "H", "H"], // softTotal = A,2
];

export const pairSplitDecisionMap: string[][] = [
//    2     3     4    5     6     7    8    9   10    A    <-- Dealer upcard
    ["Y",  "Y",  "Y", "Y",  "Y",  "Y", "Y", "Y", "Y", "Y"], // pair splitting = A,A
    ["N",  "N",  "N", "N",  "N",  "N", "N", "N", "N", "N"], // pair splitting = T,T
    ["Y",  "Y",  "Y", "Y",  "Y",  "N", "Y", "Y", "N", "N"], // pair splitting = 9,9
    ["Y",  "Y",  "Y", "Y",  "Y",  "Y", "Y", "Y", "Y", "Y"], // pair splitting = 8,8
    ["Y",  "Y",  "Y", "Y",  "Y",  "Y", "N", "N", "N", "N"], // pair splitting = 7,7
    ["YN", "Y",  "Y", "Y",  "Y",  "N", "N", "N", "N", "N"], // pair splitting = 6,6
    ["N",  "N",  "N", "N",  "N",  "N", "N", "N", "N", "N"], // pair splitting = 5,5
    ["N",  "N",  "N", "YN", "YN", "N", "N", "N", "N", "N"], // pair splitting = 4,4
    ["YN", "YN", "Y", "Y",  "Y",  "Y", "N", "N", "N", "N"], // pair splitting = 3,3
    ["YN", "YN", "Y", "Y",  "Y",  "Y", "N", "N", "N", "N"], // pair splitting = 2,2
];

// TODO: surrender not implemented yet
// export const surrenderDecisionMap: string[][] = [
// //    2     3     4    5     6     7    8    9   10    A    <-- Dealer upcard
//     ["N",  "N",  "N", "N",  "N",  "N", "N", "Y", "Y", "Y"], // total = 16
//     ["N",  "N",  "N", "N",  "N",  "N", "N", "N", "Y", "N"], // total = 15
//     ["N",  "N",  "N", "N",  "N",  "N", "N", "N", "N", "N"], // total = 14
// ]

function getDealerUpCardColumn(dealerUpCard: string): number {
    switch (dealerUpCard) {
        case "2": return 0;
        case "3": return 1;
        case "4": return 2;
        case "5": return 3;
        case "6": return 4;
        case "7": return 5;
        case "8": return 6;
        case "9": return 7;
        case "10": return 8;
        case "J": return 8;
        case "Q": return 8;
        case "K": return 8;
        case "A": return 9;
        default: return 0; // TODO: deal with error case
    }
}

export function getHardTotalDecision(hardTotal: number, dealerUpCard: string): string {
    const col = getDealerUpCardColumn(dealerUpCard);
    let row = 0;
    switch (hardTotal) {
        case 17: row = 0; break;
        case 16: row = 1; break;
        case 15: row = 2; break;
        case 14: row = 3; break;
        case 13: row = 4; break;
        case 12: row = 5; break;
        case 11: row = 6; break;
        case 10: row = 7; break;
        case 9: row = 8; break;
        case 8: row = 9; break;
        default: row = 0; break; // TODO: deal with error case
    }

    // deal with edge cases (not explicitly defined in basic strategy charts)
    if (hardTotal > 17) {
        row = 0;
    } else if (hardTotal < 8) {
        row = 9;
    }

    return hardTotalDecisionMap[row][col];
}

export function getSoftTotalDecision(playerNonAceTotal: number, dealerUpCard: string): string {
    const col = getDealerUpCardColumn(dealerUpCard);
    let row = 0;
    switch (playerNonAceTotal) {
        case 9: row = 0; break;
        case 8: row = 1; break;
        case 7: row = 2; break;
        case 6: row = 3; break;
        case 5: row = 4; break;
        case 4: row = 5; break;
        case 3: row = 6; break;
        case 2: row = 7; break;
        default: row = 0; break; // TODO: deal with error case
    }

    return softTotalDecisionMap[row][col];
}

export function getPairSplitDecision(playerSplitCard: string, dealerUpCard: string): string {
    const col = getDealerUpCardColumn(dealerUpCard);
    let row = 0;

    switch (playerSplitCard) {
        case "A": row = 0; break;
        case "T": row = 1; break;
        case "9": row = 2; break;
        case "8": row = 3; break;
        case "7": row = 4; break;
        case "6": row = 5; break;
        case "5": row = 6; break;
        case "4": row = 7; break;
        case "3": row = 8; break;
        case "2": row = 9; break;
        default: row = 0; break; // TODO: deal with error case
    }

    return pairSplitDecisionMap[row][col];
}
