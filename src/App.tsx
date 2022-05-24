import { useState } from "react";
import Square from "./components/Square";

const App = () => {
  const [squares, setSquares] = useState<string[] | []>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState<boolean>(true);
  const [isBeat, setIsBeat] = useState<boolean>(true);

  const checkWinner = (squares: [] | string[]): any => {
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

  const handleTurn = (i: number): void => {
    if (checkWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = isXTurn ? "X" : "O";
    setSquares(squares);
    setIsXTurn(!isXTurn);
  };

  const winningPattern = checkWinner(squares);
  const isBoardFull = squares.every((i) => i !== null);

  let status;

  if (winningPattern) {
    status = `Winner: ${isXTurn ? "O" : "X"}`;
  } else if (isBoardFull && !winningPattern) {
    status = "Draw!";
  } else {
    status = "Player: " + (isXTurn ? "X" : "O");
  }

  const handleRestart = (): void => {
    setIsXTurn(true);
    setSquares(Array(9).fill(null));
    setIsBeat((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="space-y-4 sm:space-y-8">
        <h1 className="font-bold">TIC-TAC-TOE</h1>

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
                `winning-color ${isBeat ? "animate-beat" : "animate-bounce"}`
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <p>RESET</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
