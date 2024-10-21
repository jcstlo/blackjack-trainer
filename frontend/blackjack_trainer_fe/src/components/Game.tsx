import Actions from './Actions'
import { useState } from "react"
import { Decision, DecisionCount, GameState, WinnerState } from '../game-logic/GameLogic';
import { newPlayerHand } from '../game-logic/PlayerHands';
import { DealerHandVisual } from './DealerHandVisual';
import { PlayerHandsVisual } from './PlayerHandsVisual';
import { WinnerVisual } from './WinnerVisual';
import { CorrectPlayVisual } from './CorrectPlayVisual';
import { DecisionCountVisual } from './DecisionCountVisual';
import { IncorrectActionsSidebar } from './IncorrectActionsVisual';
import { Header } from './Header';

function Game() {
    const [gameState, setGameState] = useState(GameState.Idle);
    const [playerHands, setPlayerHands] = useState(newPlayerHand());
    const [dealerHand, setDealerHand] = useState([] as string[]);
    const [deck, setDeck] = useState([] as string[]);
    const [faceDown, setFaceDown] = useState(false);
    const [winner, setWinner] = useState([] as WinnerState[]);
    const [incorrectActions, setIncorrectActions] = useState([] as string[]);

    const newDecision: Decision = {
        show: false,
        playerDecision: "",
        correctDecision: "",
        correct: false,
        actionContext: ""
    };
    const newDecisionCount: DecisionCount = {
        correctDecisionCount: 0,
        totalDecisionCount: 0
    }
    const [decision, setDecision] = useState(newDecision as Decision);
    const [decisionCount, setDecisionCount] = useState(newDecisionCount as DecisionCount);

    return (
        <>
            <Header/>
            <DealerHandVisual hand={dealerHand} faceDown={faceDown}/>
            <PlayerHandsVisual pHands={playerHands}/>
            <Actions
              gameState={gameState}
              gameStateSetter={setGameState}
              dealerHand={dealerHand}
              dealerHandSetter={setDealerHand}
              playerHands={playerHands}
              playerHandsSetter={setPlayerHands}
              deck={deck}
              deckSetter={setDeck}
              faceDownSetter={setFaceDown}
              winnerSetter={setWinner}
              decisionSetter={setDecision}
              decisionCount={decisionCount}
              decisionCountSetter={setDecisionCount}
              incorrectActions={incorrectActions}
              incorrectActionsSetter={setIncorrectActions}
            />
            <WinnerVisual winners={winner}/>
            <CorrectPlayVisual
              show={decision.show}
              playerDecision={decision.playerDecision}
              correctDecision={decision.correctDecision}
              correct={decision.correct}
              actionContext={decision.actionContext}
            />
            <DecisionCountVisual
              correctDecisionCount={decisionCount.correctDecisionCount}
              totalDecisionCount={decisionCount.totalDecisionCount}
            />
            <IncorrectActionsSidebar
              incorrectActions={incorrectActions}
            />
        </>
    )
}

export default Game
