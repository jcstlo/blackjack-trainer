import { calculateHandCount, extractCardRank, getRankValue } from "../game-logic/HandCount";

interface DealerCountProps {
    dealerHand: string[];
    faceDown: boolean;
}

interface PlayerCountProps {
    playerHand: string[];
}

export function DealerCount(props: DealerCountProps) {
    const dealerCount = calculateHandCount(props.dealerHand);
    let trueDealerCount = 0;

    if (props.faceDown) {
        // if facedown, only show count for one card
        const card = props.dealerHand[0];
        const rank = extractCardRank(card);
        trueDealerCount = getRankValue(rank);
        if (rank === "A") {
            trueDealerCount = 11;
        }
    } else {
        // if not facedown, show count for all cards
        if (dealerCount.softCount > 21) {
            trueDealerCount = dealerCount.hardCount;
        } else {
            trueDealerCount = dealerCount.softCount;
        }
    }


    return (
        <p className="text-center">count = {trueDealerCount}</p>
    )
}

export function PlayerCount(props: PlayerCountProps) {
    const playerCount = calculateHandCount(props.playerHand);
    let truePlayerCount = 0;

    if (playerCount.softCount > 21) {
        truePlayerCount = playerCount.hardCount;
    } else {
        truePlayerCount = playerCount.softCount;
    }

    return (
        <p className="text-center">count = {truePlayerCount}</p>
    )
}
