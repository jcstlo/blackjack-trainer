import { checkCount, drawCard, GameState } from "./GameLogic"
import { uniqueCards } from "./Cards";
import { shuffleDeck } from "./GameLogic";

interface ActionProps {
    gameState: GameState;
    gameStateSetter: React.Dispatch<React.SetStateAction<GameState>>;
    dealerHand: string[];
    dealerHandSetter: React.Dispatch<React.SetStateAction<string[]>>;
    playerHand: string[];
    playerHandSetter: React.Dispatch<React.SetStateAction<string[]>>;
    deck: string[];
    deckSetter: React.Dispatch<React.SetStateAction<string[]>>;
}


function Actions(props: ActionProps) {
    let buttons: JSX.Element;
    if (props.gameState === GameState.GetChoice) {
        buttons = (<>
            <button
              onClick={HitHandler}
            >
              Hit
            </button>
            <button
              onClick={StandHandler}
            >
              Stand
            </button>
        </>);
    } else {
        buttons = (<>
            <button
              onClick={NewGameHandler}
            >
              New Game
            </button>
        </>);
    }

    return (
        <>
            {buttons}
        </>
    )

    // ------------ Convenience functions ------------
    function checkWinner(playerCount: number, dealerCount: number): void {
        console.log(`playerCount = ${playerCount}`)
        console.log(`dealerCount = ${dealerCount}`)
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
    }

    function dealDealerCards(latestPlayerHand: string[]): void {
        const updatedDealerHand = [...props.dealerHand];
        const updatedDeck = [...props.deck];

        // continuously deal cards until dealer hits >= 17
        let dealerCount = checkCount(updatedDealerHand);
        while (dealerCount < 17) {
            updatedDealerHand.push(drawCard(updatedDeck));
            dealerCount = checkCount(updatedDealerHand);
        }

        // check winner
        const playerCount = checkCount(latestPlayerHand);
        checkWinner(playerCount, dealerCount);

        props.dealerHandSetter(updatedDealerHand);
        props.deckSetter(updatedDeck);
    }

    // ------------ Handlers ------------
    function NewGameHandler(): undefined {
        // reset player and dealer hands
        const newPlayerHand: string[] = [];
        const newDealerHand: string[] = [];

        // shuffle new deck
        const sortedDeck: string[] = [...uniqueCards];
        const shuffled: string[] = shuffleDeck(sortedDeck);

        // deal first cards
        newPlayerHand.push(drawCard(shuffled));
        newDealerHand.push(drawCard(shuffled));
        newPlayerHand.push(drawCard(shuffled));
        newDealerHand.push(drawCard(shuffled));

        // update state
        props.playerHandSetter(newPlayerHand);
        props.dealerHandSetter(newDealerHand);
        props.deckSetter(shuffled);
        props.gameStateSetter(GameState.GetChoice);
    }

    function HitHandler(): undefined {
        const updatedPlayerHand = [...props.playerHand];
        const updatedDeck = [...props.deck];

        // deal card to player
        updatedPlayerHand.push(drawCard(updatedDeck));

        // check if player hit >= 21
        const playerCount = checkCount(updatedPlayerHand);
        const dealerCount = checkCount(props.dealerHand);
        if (playerCount > 21) {
            checkWinner(playerCount, dealerCount);
            props.gameStateSetter(GameState.Idle);
        } else if (playerCount === 21) {
            dealDealerCards(updatedPlayerHand);
            props.gameStateSetter(GameState.Idle);
        } else {
            props.gameStateSetter(GameState.GetChoice);
        }

        // update state
        props.playerHandSetter(updatedPlayerHand);
        props.deckSetter(updatedDeck);
    }

    function StandHandler(): undefined {
        dealDealerCards([...props.playerHand]);

        // update state
        props.gameStateSetter(GameState.Idle);
    }
}

export default Actions
