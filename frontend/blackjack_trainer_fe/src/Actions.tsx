import { Decision, DecisionCount, drawCard, GameState, WinnerState } from "./GameLogic"
import { uniqueCards } from "./Cards";
import { shuffleDeck, checkWinner, dealAnotherDealerCard, playersStillInGame } from "./GameLogic";
import { calculateHandCount, HandCount } from "./HandCount";
import { addCardToHand, clonePlayerHands, isSplitPossible, newPlayerHand, PlayerHands, splitHand } from "./PlayerHands";
import { evaluateDecision, evaluateDecisionCount } from "./Training";

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
    decisionSetter: React.Dispatch<React.SetStateAction<Decision>>;
    decisionCount: DecisionCount;
    decisionCountSetter: React.Dispatch<React.SetStateAction<DecisionCount>>;
}

function Actions(props: ActionProps) {
    let buttons: JSX.Element;
    const buttonStyle = "ml-3 mr-3 rounded pl-4 pr-4 pt-2 pb-2 bg-blue-600 text-slate-100 font-bold drop-shadow-lg";
    if (props.gameState === GameState.GetChoice) {
        buttons = (<>
            <button className={buttonStyle} onClick={HitHandler}>Hit</button>
            <button className={buttonStyle} onClick={StandHandler}>Stand</button>
            <button className={buttonStyle} onClick={SplitHandler}>Split</button>
        </>);
    } else if (props.gameState === GameState.GetFirstChoice) {
        buttons = (<>
            <button className={buttonStyle} onClick={HitHandler}>Hit</button>
            <button className={buttonStyle} onClick={StandHandler}>Stand</button>
            <button className={buttonStyle} onClick={SplitHandler}>Split</button>
            <button className={buttonStyle} onClick={DoubleHandler}>Double</button>
        </>);
    } else {
        buttons = (<>
            <button className={buttonStyle} onClick={NewGameHandler}>New Game</button>
        </>);
    }

    return (
        <div className="flex justify-center">{buttons}</div>
    )

    // ------------ Convenience functions ------------
    function checkWinners(playerHands: PlayerHands, dealerCount: HandCount): void {
        const winners: WinnerState[] = [];

        for (let i = 0; i < playerHands.numHands; i++) {
            const playerCount = calculateHandCount(playerHands.hands[i]);
            const winner = checkWinner(playerCount, dealerCount);
            winners.push(winner);
        }

        props.winnerSetter(winners);
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

        // reset decision and decisionCount states
        const newDecision: Decision = {
            show: false,
            playerDecision: "",
            correctDecision: "",
            correct: false
        }

        // update state
        props.playerHandsSetter(newPlayerHands);
        props.dealerHandSetter(newDealerHand);
        props.deckSetter(shuffled);
        props.faceDownSetter(true);
        props.gameStateSetter(GameState.GetFirstChoice);
        props.winnerSetter(resetWinners);
        props.decisionSetter(newDecision);
    }

    function HitHandler(): undefined {
        const updatedPlayerHands = clonePlayerHands(props.playerHands);
        const updatedDeck = [...props.deck];

        // evaluate decision
        const newDecision = evaluateDecision(props.dealerHand[0], props.playerHands.hands[props.playerHands.focus], "Hit");
        const newDecisionCount = evaluateDecisionCount(newDecision, props.decisionCount);

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
        props.decisionSetter(newDecision);
        props.playerHandsSetter(updatedPlayerHands);
        props.deckSetter(updatedDeck);
        props.decisionCountSetter(newDecisionCount);
    }

    function StandHandler(): undefined {
        const updatedPlayerHands = clonePlayerHands(props.playerHands);

        // evaluate decision
        const newDecision = evaluateDecision(props.dealerHand[0], props.playerHands.hands[props.playerHands.focus], "Stand");
        const newDecisionCount = evaluateDecisionCount(newDecision, props.decisionCount);

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
        props.decisionSetter(newDecision);
        props.decisionCountSetter(newDecisionCount);
    }

    function SplitHandler(): undefined {
        const updatedPlayerHands = clonePlayerHands(props.playerHands);

        // evaluate decision
        if (isSplitPossible(updatedPlayerHands.hands[updatedPlayerHands.focus])) {
            const newDecision = evaluateDecision(props.dealerHand[0], props.playerHands.hands[props.playerHands.focus], "Split");
            const newDecisionCount = evaluateDecisionCount(newDecision, props.decisionCount);
            props.decisionSetter(newDecision);
            props.decisionCountSetter(newDecisionCount);
        }

        if (!splitHand(updatedPlayerHands)) {
            console.log("Split is not possible with these cards!")
        }

        // update state
        props.playerHandsSetter(updatedPlayerHands);
    }

    function DoubleHandler(): undefined {
        const updatedPlayerHands = clonePlayerHands(props.playerHands);
        const updatedDeck = [...props.deck];

        // evaluate decision
        const newDecision = evaluateDecision(props.dealerHand[0], props.playerHands.hands[props.playerHands.focus], "Double");
        const newDecisionCount = evaluateDecisionCount(newDecision, props.decisionCount);

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
        props.decisionSetter(newDecision);
        props.decisionCountSetter(newDecisionCount);
    }
}

export default Actions
