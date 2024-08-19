import { drawCard, GameState } from "./GameLogic"
import { uniqueCards } from "./Cards";
import { shuffleDeck } from "./GameLogic";
import { calculateHandCount, HandCount } from "./HandCount";
import { addCardToHand, clonePlayerHands, newPlayerHand, PlayerHands, splitHand } from "./PlayerHands";

interface ActionProps {
    gameState: GameState;
    gameStateSetter: React.Dispatch<React.SetStateAction<GameState>>;
    dealerHand: string[];
    dealerHandSetter: React.Dispatch<React.SetStateAction<string[]>>;
    playerHands: PlayerHands;
    playerHandsSetter: React.Dispatch<React.SetStateAction<PlayerHands>>;
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
            <button onClick={SplitHandler}>
              Split
            </button>
        </>);
    } else if (props.gameState === GameState.GetFirstChoice) {
        buttons = (<>
            <button onClick={HitHandler}>
              Hit
            </button>
            <button onClick={StandHandler}>
              Stand
            </button>
            <button onClick={SplitHandler}>
              Split
            </button>
            <button onClick={DoubleHandler}>
              Double
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

    function checkWinners(playerHands: PlayerHands, dealerCount: HandCount): void {
        for (let i = 0; i < playerHands.numHands; i++) {
            console.log(`PLAYER HAND ${i}`);
            const playerCount = calculateHandCount(playerHands.hands[i]);
            checkWinner(playerCount, dealerCount);
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

    function playersStillInGame(playerHands: PlayerHands): boolean {
        for (let i = 0; i < playerHands.numHands; i++) {
            const hand = playerHands.hands[i];
            const playerCount = calculateHandCount(hand);
            if (playerCount.hardCount <= 21) {
                return true;
            }
        }
        return false;
    }

    function dealDealerCards(latestPlayerHands: PlayerHands): void {
        const updatedDealerHand = [...props.dealerHand];
        const updatedDeck = [...props.deck];

        // deal dealer cards if there are any player hands that haven't busted
        let dealerCount = calculateHandCount(updatedDealerHand);
        if (playersStillInGame(latestPlayerHands)) {
            while (dealAnotherDealerCard(dealerCount)) {
                updatedDealerHand.push(drawCard(updatedDeck));
                dealerCount = calculateHandCount(updatedDealerHand);
            }
        }

        // check winner
        checkWinners(latestPlayerHands, dealerCount);

        // update state
        props.dealerHandSetter(updatedDealerHand);
        props.deckSetter(updatedDeck);
    }

    // ------------ Handlers ------------
    function NewGameHandler(): undefined {
        // reset player and dealer hands
        const newPlayerHands = newPlayerHand();
        const newDealerHand: string[] = [];

        // shuffle new deck
        const sortedDeck: string[] = [...uniqueCards];
        const shuffled: string[] = shuffleDeck(sortedDeck);

        // deal first cards
        addCardToHand(newPlayerHands, drawCard(shuffled));
        newDealerHand.push(drawCard(shuffled));
        addCardToHand(newPlayerHands, drawCard(shuffled));
        newDealerHand.push(drawCard(shuffled)); // TODO: make this face down

        // update state
        props.playerHandsSetter(newPlayerHands);
        props.dealerHandSetter(newDealerHand);
        props.deckSetter(shuffled);
        props.gameStateSetter(GameState.GetFirstChoice);
    }

    function HitHandler(): undefined {
        const updatedPlayerHands = clonePlayerHands(props.playerHands);
        const updatedDeck = [...props.deck];

        // deal card to player
        addCardToHand(updatedPlayerHands, drawCard(updatedDeck));

        // check if player hit >= 21
        const playerCount = calculateHandCount(updatedPlayerHands.hands[updatedPlayerHands.focus]);

        if (playerCount.hardCount > 21) {
            if (updatedPlayerHands.focus === updatedPlayerHands.numHands-1) {
                dealDealerCards(updatedPlayerHands);
                props.gameStateSetter(GameState.Idle);
            } else {
                updatedPlayerHands.focus += 1;
                props.gameStateSetter(GameState.GetFirstChoice);
            }
        } else if (playerCount.softCount === 21 || playerCount.hardCount === 21) {
            if (updatedPlayerHands.focus === updatedPlayerHands.numHands-1) {
                dealDealerCards(updatedPlayerHands);
                props.gameStateSetter(GameState.Idle);
            } else {
                updatedPlayerHands.focus += 1;
                props.gameStateSetter(GameState.GetFirstChoice);
            }
        } else {
            props.gameStateSetter(GameState.GetChoice);
        }

        // update state
        props.playerHandsSetter(updatedPlayerHands);
        props.deckSetter(updatedDeck);
    }

    function StandHandler(): undefined {
        const updatedPlayerHands = clonePlayerHands(props.playerHands);

        if (updatedPlayerHands.focus === updatedPlayerHands.numHands-1) {
            dealDealerCards(props.playerHands);
            props.gameStateSetter(GameState.Idle);
        } else {
            updatedPlayerHands.focus += 1;
            props.gameStateSetter(GameState.GetFirstChoice);
        }

        // update state
        props.playerHandsSetter(updatedPlayerHands);
    }

    function SplitHandler(): undefined {
        const updatedPlayerHands = clonePlayerHands(props.playerHands);

        if (!splitHand(updatedPlayerHands)) {
            console.log("Split is not possible with these cards!")
        }

        // update state
        props.playerHandsSetter(updatedPlayerHands);
    }

    function DoubleHandler(): undefined {
        const updatedPlayerHands = clonePlayerHands(props.playerHands);
        const updatedDeck = [...props.deck];

        // deal card to player
        addCardToHand(updatedPlayerHands, drawCard(updatedDeck));

        if (updatedPlayerHands.focus === updatedPlayerHands.numHands-1) {
            dealDealerCards(updatedPlayerHands);
            props.gameStateSetter(GameState.Idle);
        } else {
            updatedPlayerHands.focus += 1;
            props.gameStateSetter(GameState.GetFirstChoice);
        }

        // update state
        props.playerHandsSetter(updatedPlayerHands);
        props.deckSetter(updatedDeck);
    }
}

export default Actions
