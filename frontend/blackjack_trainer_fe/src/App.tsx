import Actions from './Actions'
import { gameLoop } from './GameLogic'
import { DealerHand, PlayerHand } from './Hands'

function App() {
  // gameLoop();

  return (
    <>
      <DealerHand/>
      <PlayerHand/>
      <Actions/>
    </>
  )
}

export default App
