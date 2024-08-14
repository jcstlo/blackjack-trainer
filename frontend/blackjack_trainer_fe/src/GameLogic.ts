// pseudocode for sample game flow
// idle
// -(startGame)> startGame -> myCard -> dealerCardFaceUp -> myCard -> dealerCardFaceDown -> myChoice
// -(hit...)> myChoice...
// -(stand)> dealerFlipCardUp
// -(under 17...)> dealerCardFaceUp...
// -(17 or more)> checkWhoWins -> endGame -> idle
import { uniqueCards } from "./Cards";

enum GameState {
    Idle,
    StartGame,
    GetChoice,
    DealPlayerCard,
    FlipDealerCardUp,
    DealDealerCard,
    CheckWinner,
    EndGame
}

function shuffleDeck(deck: string[]): string[] {
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

function drawCard(deck: string[]): string {
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
                // TODO: if player count > 21, end game
                // TODO: if player count == 21, go to dealer card
                console.log("Dealing player card...")
                playerHand.push(drawCard(deck));
                currState = GameState.GetChoice;
                break;
            case GameState.DealDealerCard:
                // TODO: if dealer count < 17, deal another dealer card
                // TODO: if dealer count >= 17, check winner
                console.log("Dealing dealer card...")
                dealerHand.push(drawCard(deck));
                currState = GameState.CheckWinner;
                break;
            case GameState.FlipDealerCardUp:
                // TODO: flip dealer card up
                // TODO: if dealer count < 17, deal another dealer card
                // TODO: if dealer count >= 17, check winner
                console.log("Flipping dealer card up...")
                currState = GameState.DealDealerCard;
                break;
            case GameState.CheckWinner:
                // TODO: check winner
                console.log("Checking who won...")
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
    }
}
