import { Decision, DecisionCount, drawCard, GameState, WinnerState } from "../game-logic/GameLogic";
import { uniqueCards } from "../game-logic/Cards";
import { shuffleDeck, checkWinner, dealAnotherDealerCard, playersStillInGame } from "../game-logic/GameLogic";
import { calculateHandCount, HandCount } from "../game-logic/HandCount";
import { addCardToHand, clonePlayerHands, isSplitPossible, newPlayerHand, PlayerHands, splitHand } from "../game-logic/PlayerHands";
import { evaluateDecision, evaluateDecisionCount } from "../game-logic/Training";

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
    incorrectActions: string[];
    incorrectActionsSetter: React.Dispatch<React.SetStateAction<string[]>>;
}

function Actions(props: ActionProps) {
    const buttonsArray: JSX.Element[] = [];
    const buttonStyle = "ml-3 mr-3 rounded pl-4 pr-4 pt-2 pb-2 bg-blue-600 text-slate-100 font-bold drop-shadow-lg";

    const HitButton = <button className={buttonStyle} onClick={HitHandler}>Hit</button>;
    const StandButton = <button className={buttonStyle} onClick={StandHandler}>Stand</button>;
    const SplitButton = <button className={buttonStyle} onClick={SplitHandler}>Split</button>;
    const DoubleButton = <button className={buttonStyle} onClick={DoubleHandler}>Double</button>;
    const NewGameButton = <button className={buttonStyle} onClick={NewGameHandler}>New Game</button>;

    if (props.gameState === GameState.Idle) {
        buttonsArray.push(NewGameButton);
    } else {
        buttonsArray.push(HitButton);
        buttonsArray.push(StandButton);

        if (props.gameState === GameState.GetFirstChoice) {
            buttonsArray.push(DoubleButton);
        }

        const currentPlayerHand = props.playerHands.hands[props.playerHands.focus];
        if (isSplitPossible(currentPlayerHand)) {
            buttonsArray.push(SplitButton);
        }
    }

    return (
        <div className="flex justify-center">{buttonsArray}</div>
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

    function addIncorrectAction(decision: Decision) {
        if (decision.correct) {
            return;
        }
        const s = `${decision.playerDecision} on ${decision.actionContext} - You should ${decision.correctDecision}`

        const newIncorrectActions = [...props.incorrectActions];
        if (newIncorrectActions.length >= 10) {
            newIncorrectActions.splice(-1, 1);
        }
        newIncorrectActions.splice(0, 0, s);
        props.incorrectActionsSetter(newIncorrectActions);
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
            correct: false,
            actionContext: ""
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
        const newDecision = evaluateDecision(props.dealerHand[0], props.playerHands.hands[props.playerHands.focus], "Hit", props.gameState);
        const newDecisionCount = evaluateDecisionCount(newDecision, props.decisionCount);
        addIncorrectAction(newDecision);

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
        const newDecision = evaluateDecision(props.dealerHand[0], props.playerHands.hands[props.playerHands.focus], "Stand", props.gameState);
        const newDecisionCount = evaluateDecisionCount(newDecision, props.decisionCount);
        addIncorrectAction(newDecision);

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
            const newDecision = evaluateDecision(props.dealerHand[0], props.playerHands.hands[props.playerHands.focus], "Split", props.gameState);
            const newDecisionCount = evaluateDecisionCount(newDecision, props.decisionCount);
            props.decisionSetter(newDecision);
            props.decisionCountSetter(newDecisionCount);
            addIncorrectAction(newDecision);
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
        const newDecision = evaluateDecision(props.dealerHand[0], props.playerHands.hands[props.playerHands.focus], "Double", props.gameState);
        const newDecisionCount = evaluateDecisionCount(newDecision, props.decisionCount);
        addIncorrectAction(newDecision);

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
