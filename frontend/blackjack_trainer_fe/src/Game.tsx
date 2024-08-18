import Actions from './Actions'
import { DealerHand, MultiplePlayerHands } from './Hands'
import { useState } from "react"
import { GameState } from "./GameLogic"
import { newPlayerHand } from './PlayerHands';
import { DebugUI } from './DebugUI';

function Game() {
    const [gameState, setGameState] = useState(GameState.Idle);
    const [playerHands, setPlayerHands] = useState(newPlayerHand());
    const [dealerHand, setDealerHand] = useState([] as string[]);
    const [deck, setDeck] = useState([] as string[]);

    return (
        <>
            <DealerHand hand={dealerHand}/>
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
            />
            <DebugUI gameState={gameState} playerHands={playerHands}/>
        </>
    )
}

export default Game
