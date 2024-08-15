import { useState } from "react"
import { GameState } from "./GameLogic"

function Game() {
    const [gameState, setGameState] = useState(GameState.Idle);
    const [playerHand, setPlayerHand] = useState([] as string[]);
    const [dealerHand, setDealerHand] = useState([] as string[]);

    return (
        <>
        {/*
            <DealerHand/>
            <PlayerHand/>
            <Actions/>
        */}
        </>
    )
}

export default Game
