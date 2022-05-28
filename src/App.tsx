import { useEffect, useState } from "react";
import { ResetIcon, SinglePlayer, Multiplayer } from "./components/Icons";
import Square from "./components/Square";

const App = () => {
  const [squares, setSquares] = useState<string[] | []>(Array(9).fill(null));
  const [isSinglePlayer, setIsSinglePlayer] = useState<boolean>(true);

  const [isXTurn, setIsXTurn] = useState<boolean>(true);
  const [animation, setAnimation] = useState<number>(0);

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isPlayerTurn =
    squares.filter((square) => square !== null).length % 2 === 0;
  const isComputerTurn =
    squares.filter((square) => square !== null).length % 2 === 1;
  const emptyIndexes = squares
    .map((square, index) => (square === null ? index : null))
    .filter((val) => val !== null);
  const isBoardFull = squares.every((i) => i !== null);

  const linesThatAre = (
    a: string | null,
    b: string | null,
    c: string | null
  ) => {
    return winConditions.filter((squareIndexes) => {
      const squareValues = squareIndexes.map((index) => squares[index]);
      return (
        JSON.stringify([a, b, c].sort()) === JSON.stringify(squareValues.sort())
      );
    });
  };

  const checkWinner = (squares: [] | string[]): any => {
    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return winConditions[i];
      }
    }

    return null;
  };

  const winningPattern = checkWinner(squares);

  const handleTurn = (i: number): void => {
    if (checkWinner(squares) || squares[i]) {
      return;
    }

    if (!isSinglePlayer) {
      squares[i] = isXTurn ? "X" : "O";
      setSquares(squares);
      setIsXTurn(!isXTurn);

      return;
    }

    if (isPlayerTurn) {
      let newSquares = squares;
      newSquares[i] = "X";
      setSquares([...newSquares]);
    }
  };

  let status;

  if (winningPattern) {
    if (!isSinglePlayer) {
      status = `Winner: ${isXTurn ? "O" : "X"}`;
    }
    status = `${isPlayerTurn ? "You lost!" : "You won!"}`;
  } else if (isBoardFull && !winningPattern) {
    status = "Draw!";
  } else {
    if (!isSinglePlayer) {
      status = "Player: " + (isXTurn ? "X" : "O");
    } else if (isSinglePlayer) {
      status = `${isPlayerTurn ? "Your turn" : "Thinking..."}`;
    }
  }

  let delayTurn: any;

  const putComputerAtSquare = (i: any) => {
    let newSquares = squares;
    newSquares[i] = "O";
    // add a half second delay on computer turn
    delayTurn = window.setTimeout(() => {
      setSquares([...newSquares]);
    }, 1000);
  };

  const handleRestart = (): void => {
    clearTimeout(delayTurn);
    setIsXTurn(true);
    setSquares(Array(9).fill(null));

    if (winningPattern) {
      if (animation === 2) {
        setAnimation(0);
      } else {
        setAnimation((prev) => prev + 1);
      }
    }
  };

  const handleGameMode = (): void => {
    handleRestart();
    setIsSinglePlayer((prev) => !prev);
  };

  useEffect(() => {
    if (isComputerTurn) {
      // Priority: computer marks middle tile if vacant and corner tiles are marked
      if (
        squares[4] === null &&
        !squares[1] &&
        !squares[3] &&
        !squares[5] &&
        !squares[7]
      ) {
        putComputerAtSquare(4);
        return;
      }
      // Priority: win game
      const winningLines = linesThatAre("O", "O", null);
      if (winningLines.length > 0) {
        const winningIndex = winningLines[0].filter(
          (index) => squares[index] === null
        )[0];
        if (!winningPattern && !isBoardFull) putComputerAtSquare(winningIndex);
        return;
      }
      // Priority: block opponent
      const linesToBlock = linesThatAre("X", "X", null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(
          (index) => squares[index] === null
        )[0];
        if (!winningPattern && !isBoardFull) putComputerAtSquare(blockIndex);
        return;
      }
      // Priority: prioritize turns that can lead closer to winning
      const linesToContinue = linesThatAre("O", null, null);
      if (linesToContinue.length > 0) {
        if (!winningPattern && !isBoardFull) {
          putComputerAtSquare(
            linesToContinue[0].filter((index) => squares[index] === null)[0]
          );
        }

        return;
      }
      // randomize computer turn if priority moves are not applicable
      const randomIndex =
        emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
      if (!winningPattern && !isBoardFull) putComputerAtSquare(randomIndex);
    }
  }, [squares]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="space-y-4 sm:space-y-8">
        <h1 className="font-bold">TIC-TAC-TOE</h1>
        <button className="mode-btn" onClick={handleGameMode}>
          {isSinglePlayer ? (
            <div className="flex items-center space-x-2">
              <SinglePlayer className="h-4 w-4 sm:h-5 sm:w-5" />
              <p>Player vs Computer</p>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Multiplayer className="h-4 w-4 sm:h-5 sm:w-5" />
              <p>Player vs Player</p>
            </div>
          )}
        </button>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {squares.map((value, i) => (
            <Square
              key={i}
              value={value}
              onClick={() => handleTurn(i)}
              styles={`${winningPattern && "hover:cursor-default"} ${
                squares[i] === "X" ? "x-color" : squares[i] === "O" && "o-color"
              } ${squares[i] && "hover:cursor-default"} ${
                !squares[i] && "hover:bg-slate-300"
              } ${
                winningPattern?.includes(i) &&
                `winning-color ${
                  animation === 0
                    ? "animate-beat"
                    : animation === 1
                    ? "animate-bounce"
                    : animation === 2 && "animate-scale"
                }`
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between border-t pt-4 sm:pt-8">
          <p className="font-semibold bg-slate-200 px-4 py-3 rounded-md">
            {status}
          </p>
          <button
            onClick={handleRestart}
            className="flex items-center space-x-2 reset-btn"
          >
            <ResetIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <p>RESET</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
