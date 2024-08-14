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
    const shuffledDeck = [...deck];

    // shuffle array using Fisher-Yates (Knuth) Shuffle
    let currIndex = shuffledDeck.length;
    while (currIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currIndex);
        currIndex--;
        [shuffledDeck[currIndex], shuffledDeck[randomIndex]] = [shuffledDeck[randomIndex], shuffledDeck[currIndex]];
    }

    return shuffledDeck;
}

function drawCard(deck: string[]): string | undefined {
    // pop card from top of deck (last index = top of deck)
    const card = deck.pop();
    return card;
}

export function gameLoop() {
    let currState = GameState.Idle;
    let continueLoop = true;
    let userInput: string | null;

    let playerHand: string[] = [];
    let dealerHand: string[] = [];
    let deck: string[] = [...uniqueCards];

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
                // TODO: deal one player card, then deal one dealer card face up, then deal another player card, then deal another dealer card face down
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
                // TODO: deal player card
                // TODO: if player count > 21, end game
                // TODO: if player count == 21, go to dealer card
                console.log("Dealing player card...")
                currState = GameState.GetChoice;
                break;
            case GameState.DealDealerCard:
                // TODO: deal dealer card
                // TODO: if dealer count < 17, deal another dealer card
                // TODO: if dealer count >= 17, check winner
                console.log("Dealing dealer card...")
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
