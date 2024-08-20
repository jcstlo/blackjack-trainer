import Actions from './Actions'
import { MultiplePlayerHands } from './Hands'
import { useState } from "react"
import { GameState } from "./GameLogic"
import { newPlayerHand } from './PlayerHands';
import { DebugUI } from './DebugUI';
import { DealerHandVisual } from './DealerHandVisual';

function Game() {
    const [gameState, setGameState] = useState(GameState.Idle);
    const [playerHands, setPlayerHands] = useState(newPlayerHand());
    const [dealerHand, setDealerHand] = useState([] as string[]);
    const [deck, setDeck] = useState([] as string[]);
    const [faceDown, setFaceDown] = useState(false);

    return (
        <>
            <DealerHandVisual hand={dealerHand} faceDown={faceDown}/>
            <MultiplePlayerHands pHands={playerHands}/>
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
            />
            <DebugUI gameState={gameState} playerHands={playerHands}/>
        </>
    )
}

export default Game
