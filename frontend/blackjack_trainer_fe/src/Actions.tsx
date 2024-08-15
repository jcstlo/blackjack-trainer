import { drawCard, GameState } from "./GameLogic"
import { uniqueCards } from "./Cards";
import { shuffleDeck } from "./GameLogic";
import { calculateHandCount, HandCount } from "./HandCount";

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
            <button onClick={HitHandler}>
              Hit
            </button>
            <button onClick={StandHandler}>
              Stand
            </button>
        </>);
    } else {
        buttons = (<>
            <button onClick={NewGameHandler}>
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
    function checkWinner(playerCount: HandCount, dealerCount: HandCount): void {
        // figure out final hand count
        let truePlayerCount = 0;
        let trueDealerCount = 0;
        if (playerCount.softCount > 21) {
            truePlayerCount = playerCount.hardCount;
        } else {
            truePlayerCount = playerCount.softCount;
        }
        if (dealerCount.softCount > 21) {
            trueDealerCount = dealerCount.hardCount;
        } else {
            trueDealerCount = dealerCount.softCount;
        }
        console.log(`truePlayerCount = ${truePlayerCount}`)
        console.log(`trueDealerCount = ${trueDealerCount}`)

        // compare hands
        if (truePlayerCount > 21) {
            console.log("Dealer wins due to player bust!");
        } else if (trueDealerCount > 21) {
            console.log("Player wins due to dealer bust!");
        } else if (truePlayerCount > trueDealerCount) {
            console.log("Player wins!");
        } else if (truePlayerCount < trueDealerCount) {
            console.log("Dealer wins!");
        } else {
            console.log("Push!");
        }
    }

    function dealAnotherDealerCard(dealerCount: HandCount): boolean {
        // for most cases
        if (dealerCount.softCount < 17) {
            return true;
        }

        // for cases such as "4 + K + A" (softCount = 25 but hardCount = 15)
        if (dealerCount.softCount > 21 && dealerCount.hardCount < 17) {
            return true;
        }
        return false;
    }

    function dealDealerCards(latestPlayerHand: string[]): void {
        const updatedDealerHand = [...props.dealerHand];
        const updatedDeck = [...props.deck];

        // deal dealer cards
        let dealerCount = calculateHandCount(updatedDealerHand);
        while (dealAnotherDealerCard(dealerCount)) {
            updatedDealerHand.push(drawCard(updatedDeck));
            dealerCount = calculateHandCount(updatedDealerHand);
        }

        // check winner
        const playerCount = calculateHandCount(latestPlayerHand);
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
        const playerCount = calculateHandCount(updatedPlayerHand);
        const dealerCount = calculateHandCount(props.dealerHand);
        if (playerCount.hardCount > 21) {
            checkWinner(playerCount, dealerCount);
            props.gameStateSetter(GameState.Idle);
        } else if (playerCount.softCount === 21 || playerCount.hardCount === 21) {
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
