import { FC, useState, MouseEventHandler } from "react";

interface ISquare {
  value: string | null;
  onClick: MouseEventHandler<HTMLButtonElement>;
  styles: string;
}

const Square: FC<ISquare> = ({ value, onClick, styles }) => {
  return (
    <button
      className={`${styles} relative transition-all bg-slate-200 text-slate-900 rounded-lg font-bold p-11 sm:p-20 text-4xl sm:text-8xl`}
      onClick={onClick}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {value}
      </div>
    </button>
  );
};

const App: FC = () => {
  const [squares, setSquares] = useState<string[] | []>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState<boolean>(true);

  const checkWinner = (squares: [] | string[]): any => {
    const winConditions: number[][] = [
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

  const winningPattern: number[] = checkWinner(squares);
  const isBoardFull = squares.every((i) => i !== null);

  let status;

  if (winningPattern) {
    status = `Winner: ${isXTurn ? "O" : "X"}`;
  } else if (isBoardFull && !winningPattern) {
    status = "Draw!";
  } else {
    status = "Player: " + (isXTurn ? "X" : "O");
  }

  const squareWrapper = (i: number): JSX.Element => {
    const clicked = squares[i];
    const isX = clicked === "X";
    const isO = clicked === "O";
    const isGameFinish = winningPattern && "hover:cursor-default";
    const markStyles = isX ? "bg-blue-300" : isO && "bg-red-300";
    const clickedStyles = clicked && "hover:cursor-default";
    const notClickedStyles =
      !clicked && "active:bg-slate-300 hover:bg-slate-300";
    const winningPatternStyles =
      winningPattern?.includes(i) && "bg-green-300 animate-beat";

    return (
      <Square
        value={squares[i]}
        onClick={() => handleTurn(i)}
        styles={`${isGameFinish} ${markStyles} ${clickedStyles} ${notClickedStyles} ${winningPatternStyles}`}
      />
    );
  };

  const handleRestart = (): void => {
    setIsXTurn(true);
    setSquares(Array(9).fill(null));
  };

  return (
    <div className="font-mono min-h-screen flex flex-col items-center justify-center px-4">
      <div className="space-y-4 sm:space-y-8">
        <div className="text-2xl sm:text-5xl font-bold">TIC-TAC-TOE</div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {squareWrapper(0)}
          {squareWrapper(1)}
          {squareWrapper(2)}
          {squareWrapper(3)}
          {squareWrapper(4)}
          {squareWrapper(5)}
          {squareWrapper(6)}
          {squareWrapper(7)}
          {squareWrapper(8)}
        </div>
        <div className="flex items-center justify-between border-t pt-4 sm:pt-8">
          <div className="font-semibold text-sm sm:text-xl bg-slate-200 px-4 py-3 rounded-md">
            {status}
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center space-x-2 font-bold bg-violet-400 px-4 py-3 rounded-md active:scale-110 hover:bg-violet-500 transition-all text-sm sm:text-xl"
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
