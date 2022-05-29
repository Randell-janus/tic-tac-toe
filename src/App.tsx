import { useEffect, useState } from "react";
import { ResetIcon } from "./components/Icons";
import Square from "./components/Square";
import RadioButton from "./components/RadioButton";

const App = () => {
  const [squares, setSquares] = useState<string[] | []>(Array(9).fill(null));
  const [gameMode, setGameMode] = useState<string>("1");
  const [difficulty, setDifficulty] = useState<string>("hard");

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

    if (gameMode === "2") {
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
    if (gameMode === "2") {
      status = `Winner: ${isXTurn ? "O" : "X"}`;
    } else if (gameMode === "1") {
      status = `${isPlayerTurn ? "You lost!" : "You won!"}`;
    }
  } else if (isBoardFull && !winningPattern) {
    status = "Draw!";
  } else {
    if (gameMode === "2") {
      status = "Player: " + (isXTurn ? "X" : "O");
    } else if (gameMode === "1") {
      status = `${isPlayerTurn ? "Your turn" : "..."}`;
    }
  }

  let delayTurn: any;

  const putComputerAtSquare = (i: any) => {
    let newSquares = squares;
    newSquares[i] = "O";
    // add a half second delay on computer turn
    delayTurn = window.setTimeout(() => {
      setSquares([...newSquares]);
    }, 800);
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

  const handleGameMode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleRestart();
    setGameMode(e.target.value);
  };

  const handleDifficulty = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleRestart();
    setDifficulty(e.target.value);
  };

  useEffect(() => {
    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val !== null);
    const cornerIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val === 0 || val === 2 || val === 6 || val === 8);
    const crossIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val === 1 || val === 3 || val === 5 || val === 7);

    const randomCornerIndex =
      cornerIndexes[Math.floor(Math.random() * cornerIndexes.length)];
    const randomCrossIndex =
      crossIndexes[Math.floor(Math.random() * crossIndexes.length)];
    const someCornerIndexesMarked = cornerIndexes.some((i) => i !== null);

    const fullLines = linesThatAre("X", "X", "O");

    if (isComputerTurn) {
      // Priority: computer marks middle tile if vacant
      if (difficulty === "hard") {
        if (!squares[4]) {
          putComputerAtSquare(4);
          return;
        }
      }
      // computer marks corners if first player turn was middle tile, avoids y-form
      if (difficulty === "hard") {
        if (squares[4] && emptyIndexes.length === 8) {
          if (!winningPattern && !isBoardFull) {
            putComputerAtSquare(randomCornerIndex);
            return;
          }
        }
      }
      // win game
      const winningLines = linesThatAre("O", "O", null);
      if (winningLines.length > 0) {
        const winningIndex = winningLines[0].filter(
          (index) => squares[index] === null
        )[0];
        if (!winningPattern && !isBoardFull) putComputerAtSquare(winningIndex);
        return;
      }
      // block opponent
      const linesToBlock = linesThatAre("X", "X", null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(
          (index) => squares[index] === null
        )[0];
        if (!winningPattern && !isBoardFull) putComputerAtSquare(blockIndex);
        return;
      }
      // Avoids s-form
      if (difficulty === "hard") {
        const freeLines = linesThatAre(null, null, null);
        if (someCornerIndexesMarked) {
          if (freeLines.length > 0) {
            if (!winningPattern && !isBoardFull)
              putComputerAtSquare(
                freeLines[0].filter((index) => squares[index] === null)[1]
              );
            return;
          }
        }
      }
      // Avoids big triangle player move
      if (difficulty === "hard") {
        if (
          fullLines.length > 0 &&
          squares[4] === "O" &&
          emptyIndexes.length === 6
        ) {
          if (!winningPattern && !isBoardFull) {
            putComputerAtSquare(randomCrossIndex);
            return;
          }
        }
      }
      // Avoids small triangle player move
      if (difficulty === "hard") {
        if (fullLines.length === 1 && squares[4] === "X") {
          if (!winningPattern && !isBoardFull) {
            putComputerAtSquare(randomCornerIndex);
            return;
          }
        }
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
        <h1 className="font-bold text-center">TIC-TAC-TOE</h1>
        <div className="space-y-2">
          <div onChange={handleGameMode} className="flex justify-evenly">
            <RadioButton
              label="Single-player"
              value={"1"}
              defaultChecked={gameMode}
              name="mode"
            />
            <RadioButton
              label="Two-player"
              value={"2"}
              defaultChecked={gameMode}
              name="mode"
            />
          </div>
          {gameMode === "1" && (
            <div onChange={handleDifficulty} className="flex justify-evenly">
              <RadioButton
                label="Easy"
                value={"easy"}
                defaultChecked={difficulty}
                name="difficulty"
              />
              <RadioButton
                label="Hard"
                value={"hard"}
                defaultChecked={difficulty}
                name="difficulty"
              />
            </div>
          )}
        </div>

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
