export interface HandCount {
    softCount: number;
    hardCount: number;
}

function getRankValue(rank: string): number {
    switch (rank) {
        case "A": return 1;
        case "2": return 2;
        case "3": return 3;
        case "4": return 4;
        case "5": return 5;
        case "6": return 6;
        case "7": return 7;
        case "8": return 8;
        case "9": return 9;
        case "10": return 10;
        case "J": return 10;
        case "Q": return 10;
        case "K": return 10;
        default: return 0; // TODO: throw error
    }
}

function extractCardRank(card: string): string {
    const split = card.split("_");
    return split[0];
}

export function calculateHandCount(hand: string[]): HandCount {
    let hardCountSum = 0;
    let softCountSum = 0;
    let containsAce = false;
    hand.forEach((card) => {
        const rank = extractCardRank(card);
        hardCountSum += getRankValue(rank);

        if (rank === "A") {
            containsAce = true;
        }
    })

    if (containsAce) {
        softCountSum = hardCountSum + 10;
    } else {
        softCountSum = hardCountSum;
    }

    return { softCount: softCountSum, hardCount: hardCountSum };
}
