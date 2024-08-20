import Actions from './Actions'
import { useState } from "react"
import { GameState, WinnerState } from "./GameLogic"
import { newPlayerHand } from './PlayerHands';
import { DealerHandVisual } from './DealerHandVisual';
import { PlayerHandsVisual } from './PlayerHandsVisual';
import { WinnerVisual } from './WinnerVisual';

function Game() {
    const [gameState, setGameState] = useState(GameState.Idle);
    const [playerHands, setPlayerHands] = useState(newPlayerHand());
    const [dealerHand, setDealerHand] = useState([] as string[]);
    const [deck, setDeck] = useState([] as string[]);
    const [faceDown, setFaceDown] = useState(false);
    const [winner, setWinner] = useState([] as WinnerState[]);

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
            />
            <WinnerVisual winners={winner}/>
        </>
    )
}

export default Game
