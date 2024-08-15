import { GameState } from "./GameLogic"

interface ActionProps {
    gameState: GameState;
    gameStateSetter: React.Dispatch<React.SetStateAction<GameState>>;
    dealerHand: string[];
    dealerHandSetter: React.Dispatch<React.SetStateAction<string[]>>;
    playerHand: string[];
    playerHandSetter: React.Dispatch<React.SetStateAction<string[]>>;
}

function Actions(props: ActionProps) {
    let buttons: JSX.Element;
    if (props.gameState === GameState.GetChoice) {
        buttons = (<>
            <button>Hit</button>
            <button>Stand</button>
        </>);
    } else {
        buttons = <button>New Game</button>;
    }

    return (
        <>
            {buttons}
        </>
    )
}

export default Actions
