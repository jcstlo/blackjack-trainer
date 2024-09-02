import Actions from './Actions'
import { useState } from "react"
import { Decision, GameState, WinnerState } from "./GameLogic"
import { newPlayerHand } from './PlayerHands';
import { DealerHandVisual } from './DealerHandVisual';
import { PlayerHandsVisual } from './PlayerHandsVisual';
import { WinnerVisual } from './WinnerVisual';
import { CorrectPlayVisual } from './CorrectPlayVisual';

function Game() {
    const [gameState, setGameState] = useState(GameState.Idle);
    const [playerHands, setPlayerHands] = useState(newPlayerHand());
    const [dealerHand, setDealerHand] = useState([] as string[]);
    const [deck, setDeck] = useState([] as string[]);
    const [faceDown, setFaceDown] = useState(false);
    const [winner, setWinner] = useState([] as WinnerState[]);

    const newDecision: Decision = {
        show: false,
        playerDecision: "",
        correctDecision: "",
        correct: false
    };
    const [decision, setDecision] = useState(newDecision as Decision);

    return (
        <>
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
            />
            <WinnerVisual winners={winner}/>
            <CorrectPlayVisual
              show={decision.show}
              playerDecision={decision.playerDecision}
              correctDecision={decision.correctDecision}
              correct={decision.correct}
            />
        </>
    )
}

export default Game
