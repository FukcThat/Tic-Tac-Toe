// Make Board Foundation
const gameBoard = (() => {
  let board = [
    [" ", "x", " "],
    [" ", "o", " "],
    [" ", "x", " "],
  ];

  //Make sure things can't get fucked when changing stuff
  const getCurrentBoard = () => board;

  const makeMove = (row, col, playerMarker) => {
    if (board[row][col] === " ") {
      board[row][col] = playerMarker;
      return true;
    }
    return false;
  };

  const printBoard = () => {
    board.forEach((row) => {
      console.log(row.join(" | "));
    });
  };

  return { getCurrentBoard, makeMove, printBoard };
})();

const player = (name, marker) => {
  return { name, marker };
};

const gameController = (() => {
  const player1 = player("Bob", "x");
  const player2 = player("Bobettes", "o");
  let currentPlayer = player1;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };
  const playRound = (row, col) => {
    if (gameBoard.makeMove(row, col, currentPlayer.marker)) {
      gameBoard.printBoard();
      if (checkWinner(currentPlayer.marker)) {
        console.log(`${currentPlayer.name} wins!`);
        return;
      } else if (checkTie()) {
        console.log("Unpleasasnt. A Tie.");
        return;
      }
      switchPlayer();
    } else {
      console.log("That's illegal. Try again.");
    }
  };

  const checkTie = () => {
    let isTie = true;
    gameBoard.getCurrentBoard().forEach((row) => {
      row.forEach((cell) => {
        if (cell == " ") isTie = false;
      });
    });
    return isTie;
  };

  const checkWinner = (playerMarker) => {
    const board = gameBoard.getCurrentBoard();
    const winConditions = [
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    return winConditions.some((condition) =>
      condition.every((cell) => cell === playerMarker)
    );
  };

  return { playRound, getCurrentPlayer: () => currentPlayer, checkTie };
})();

console.log(gameController.checkTie());

const userInterface = (() => {
  const drawBoard = (currentBoard) => {
    const boardContainer = document.getElementById("drawnBoard");

    currentBoard.forEach((row) => {
      const rowBoi = document.createElement("div");
      rowBoi.classList.add("row");
      row.forEach((cell) => {
        const cellBoi = document.createElement("div");
        cellBoi.classList.add("cell");
        cellBoi.classList.add(cell == " " ? "none" : cell);
        rowBoi.appendChild(cellBoi);
      });
      boardContainer.appendChild(rowBoi);
    });
  };
  return { drawBoard };
})();

userInterface.drawBoard(gameBoard.getCurrentBoard());
