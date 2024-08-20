import { WinnerState } from "./GameLogic"

interface WinnerVisualProps {
    winners: WinnerState[];
}

export function WinnerVisual(props: WinnerVisualProps) {
    const jsx = props.winners.map((state: WinnerState) => {
        let text = "";
        switch (state) {
            case WinnerState.DealerWin: {
                text = "Dealer wins!";
                break;
            }
            case WinnerState.PlayerWin: {
                text = "Player wins!";
                break;
            }
            case WinnerState.Push: {
                text = "Push!";
                break;
            }
            case WinnerState.DealerWinPlayerBust: {
                text = "Dealer wins due to player bust!";
                break;
            }
            case WinnerState.PlayerWinDealerBust: {
                text = "Player wins due to dealer bust!";
                break;
            }
            default: {
                text = "ERROR;"
                break;
            }
        }
        return (<p>{text}</p>)
    })

    return (
        <>{jsx}</>
    )
}