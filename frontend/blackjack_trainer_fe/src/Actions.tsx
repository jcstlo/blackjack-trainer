import { drawCard, GameState, WinnerState } from "./GameLogic"
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
    faceDownSetter: React.Dispatch<React.SetStateAction<boolean>>;
    winnerSetter: React.Dispatch<React.SetStateAction<WinnerState[]>>;
}

function Actions(props: ActionProps) {
    let buttons: JSX.Element;
    if (props.gameState === GameState.GetChoice) {
        buttons = (<>
            <button className="ml-5 border rounded border-black" onClick={HitHandler}>Hit</button>
            <button className="ml-5 border rounded border-black" onClick={StandHandler}>Stand</button>
            <button className="ml-5 border rounded border-black" onClick={SplitHandler}>Split</button>
        </>);
    } else if (props.gameState === GameState.GetFirstChoice) {
        buttons = (<>
            <button className="ml-5 border rounded border-black" onClick={HitHandler}>Hit</button>
            <button className="ml-5 border rounded border-black" onClick={StandHandler}>Stand</button>
            <button className="ml-5 border rounded border-black" onClick={SplitHandler}>Split</button>
            <button className="ml-5 border rounded border-black" onClick={DoubleHandler}>Double</button>
        </>);
    } else {
        buttons = (<>
            <button className="ml-5 border rounded border-black" onClick={NewGameHandler}>New Game</button>
        </>);
    }

    return (
        <div>{buttons}</div>
    )

    // ------------ Convenience functions ------------
    function checkWinner(playerCount: HandCount, dealerCount: HandCount): WinnerState {
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

        // compare hands
        if (truePlayerCount > 21) {
            return WinnerState.DealerWinPlayerBust;
        } else if (trueDealerCount > 21) {
            return WinnerState.PlayerWinDealerBust;
        } else if (truePlayerCount > trueDealerCount) {
            return WinnerState.PlayerWin;
        } else if (truePlayerCount < trueDealerCount) {
            return WinnerState.DealerWin;
        } else {
            return WinnerState.Push;
        }
    }

    function checkWinners(playerHands: PlayerHands, dealerCount: HandCount): void {
        const winners: WinnerState[] = [];

        for (let i = 0; i < playerHands.numHands; i++) {
            const playerCount = calculateHandCount(playerHands.hands[i]);
            const winner = checkWinner(playerCount, dealerCount);
            winners.push(winner);
        }

        props.winnerSetter(winners);
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
        props.faceDownSetter(false);
        props.dealerHandSetter(updatedDealerHand);
        props.deckSetter(updatedDeck);
    }

    // ------------ Handlers ------------
    function NewGameHandler(): undefined {
        // reset player and dealer hands
        const newPlayerHands = newPlayerHand();
        const newDealerHand: string[] = [];
        const resetWinners: WinnerState[] = [];

        // shuffle new deck
        const sortedDeck: string[] = [...uniqueCards];
        const shuffled: string[] = shuffleDeck(sortedDeck);

        // deal first cards
        addCardToHand(newPlayerHands, drawCard(shuffled));
        newDealerHand.push(drawCard(shuffled));
        addCardToHand(newPlayerHands, drawCard(shuffled));
        newDealerHand.push(drawCard(shuffled));

        // update state
        props.playerHandsSetter(newPlayerHands);
        props.dealerHandSetter(newDealerHand);
        props.deckSetter(shuffled);
        props.faceDownSetter(true);
        props.gameStateSetter(GameState.GetFirstChoice);
        props.winnerSetter(resetWinners);
    }

    function HitHandler(): undefined {
        const updatedPlayerHands = clonePlayerHands(props.playerHands);
        const updatedDeck = [...props.deck];

        // deal card to player
        addCardToHand(updatedPlayerHands, drawCard(updatedDeck));

        // figure out next state based on player's current hand
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

        // move to next hand, or dealer's turn if all player hands are done
        if (updatedPlayerHands.focus === updatedPlayerHands.numHands-1) {
            dealDealerCards(updatedPlayerHands);
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

        // move to next hand, or dealer's turn if all player hands are done
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
