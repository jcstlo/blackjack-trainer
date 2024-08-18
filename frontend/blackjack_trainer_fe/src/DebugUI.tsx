import { GameState } from "./GameLogic";
import { PlayerHands } from "./PlayerHands";

interface DebugUIProps {
    gameState: GameState;
    playerHands: PlayerHands;
}

export function DebugUI(props: DebugUIProps) {
    return (
        <>
            <p>gameState: {props.gameState}</p>
            <p>playerHands.focus: {props.playerHands.focus}</p>
            <p>playerHands.numHands: {props.playerHands.numHands}</p>
        </>
    )
}
