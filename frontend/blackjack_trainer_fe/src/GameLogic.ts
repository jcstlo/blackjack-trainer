import { uniqueCards } from "./Cards";

export enum GameState {
    Idle,
    StartGame,
    GetChoice,
    DealPlayerCard,
    FlipDealerCardUp,
    DealDealerCard,
    CheckWinner,
    EndGame
}

function getRankValue(rank: string): number {
    switch (rank) {
        // TODO: handle hard/soft counts (e.g. A = 1 or 11)
        case "A": return 11;
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

export function checkCount(hand: string[]): number {
    let sum = 0;
    hand.forEach((card) => {
        const rank = extractCardRank(card);
        sum += getRankValue(rank);
    })
    return sum;
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

export function gameLoop() {
    let currState = GameState.Idle;
    let continueLoop = true;
    let userInput: string | null;

    const playerHand: string[] = [];
    const dealerHand: string[] = [];
    const sortedDeck: string[] = [...uniqueCards];
    const deck: string[] = shuffleDeck(sortedDeck);
    let playerCount: number = 0;
    let dealerCount: number = 0;

    while (continueLoop) {
        switch (currState) {
            case GameState.Idle:
                console.log("In idle state...")
                userInput = prompt("Start game?");
                if (typeof userInput === "string") {
                    console.log(`User chose ${userInput}`)
                    if (userInput === "yes") {
                        currState = GameState.StartGame;
                    } else if (userInput === "no") {
                        currState = GameState.EndGame;
                    } else {
                        console.log("Invalid response!");
                        // TODO: what's the expected behavior for invalid responses?
                    }
                }
                // TODO: deal with null userInput
                break;
            case GameState.StartGame:
                console.log("Starting game...")
                playerHand.push(drawCard(deck));
                dealerHand.push(drawCard(deck));
                playerHand.push(drawCard(deck));
                dealerHand.push(drawCard(deck)); // TODO: FACE DOWN

                currState = GameState.GetChoice;
                break;
            case GameState.GetChoice:
                console.log("Getting next action...")
                userInput = prompt("What is your action?");
                if (typeof userInput === "string") {
                    console.log(`User chose ${userInput}`)
                    if (userInput === "hit") {
                        currState = GameState.DealPlayerCard;
                    } else if (userInput === "stand") {
                        currState = GameState.FlipDealerCardUp;
                    } else {
                        console.log("Invalid response!");
                        // TODO: what's the expected behavior for invalid responses?
                    }
                }
                // TODO: deal with null userInput
                break;
            case GameState.DealPlayerCard:
                console.log("Dealing player card...")
                playerHand.push(drawCard(deck));

                // calculate next state based on current player count
                playerCount = checkCount(playerHand);
                if (playerCount > 21) {
                    currState = GameState.CheckWinner;
                } else if (playerCount === 21) {
                    currState = GameState.DealDealerCard;
                } else {
                    currState = GameState.GetChoice;
                }
                break;
            case GameState.DealDealerCard:
                console.log("Dealing dealer card...")
                dealerHand.push(drawCard(deck));

                // calculate next state based on current dealer count
                dealerCount = checkCount(dealerHand);
                if (dealerCount >= 17) {
                    currState = GameState.CheckWinner;
                } else {
                    currState = GameState.DealDealerCard;
                }
                break;
            case GameState.FlipDealerCardUp:
                // TODO: flip dealer card up
                console.log("Flipping dealer card up...")
                dealerCount = checkCount(dealerHand);
                if (dealerCount >= 17) {
                    currState = GameState.CheckWinner;
                } else {
                    currState = GameState.DealDealerCard;
                }
                break;
            case GameState.CheckWinner:
                console.log("Checking who won...")
                playerCount = checkCount(playerHand);
                dealerCount = checkCount(dealerHand);

                if (playerCount > 21) {
                    console.log("Dealer wins due to player bust!");
                } else if (dealerCount > 21) {
                    console.log("Player wins due to dealer bust!");
                } else if (playerCount > dealerCount) {
                    console.log("Player wins!");
                } else if (playerCount < dealerCount) {
                    console.log("Dealer wins!");
                } else {
                    console.log("Push!");
                }

                currState = GameState.EndGame;
                break;
            case GameState.EndGame:
                console.log("Ending game...")
                continueLoop = false;
                break;
            default:
                console.log("Invalid game state!")
                break;
        }
        playerCount = checkCount(playerHand);
        dealerCount = checkCount(dealerHand);
        console.log(`playerHand = ${playerHand}`)
        console.log(`playerCount = ${playerCount}`)
        console.log(`dealerHand = ${dealerHand}`)
        console.log(`dealerCount = ${dealerCount}`)
    }
}
