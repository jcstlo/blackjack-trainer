import Actions from './Actions'
import { DealerHand, PlayerHand } from './Hands'
import { useState } from "react"
import { GameState } from "./GameLogic"

function Game() {
    const [gameState, setGameState] = useState(GameState.Idle);
    const [playerHand, setPlayerHand] = useState([] as string[]);
    const [dealerHand, setDealerHand] = useState([] as string[]);
    const [deck, setDeck] = useState([] as string[]);

    return (
        <>
            <DealerHand hand={dealerHand}/>
            <PlayerHand hand={playerHand}/>
            <Actions
              gameState={gameState}
              gameStateSetter={setGameState}
              dealerHand={dealerHand}
              dealerHandSetter={setDealerHand}
              playerHand={playerHand}
              playerHandSetter={setPlayerHand}
              deck={deck}
              deckSetter={setDeck}
            />
        </>
    )
}

export default Game
