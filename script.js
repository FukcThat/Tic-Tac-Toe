// Make Board Foundation
const gameBoard = (() => {
  let board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
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
      userInterface.drawBoard(gameBoard.getCurrentBoard());
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

const userInterface = (() => {
  // Helper

  let lastClickedCell = null;

  const createSVGElement = (svgString) => {
    const template = document.createElement("template");
    template.innerHTML = svgString.trim();
    return template.content.firstChild;
  };

  const svgX = `
  <svg class="x" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path id="xStroke1" d="M10 10L90 90" stroke="white" stroke-width="10" stroke-linecap="round" />
      <path id="xStroke2" d="M90 10L10 90" stroke="white" stroke-width="10" stroke-linecap="round" />
    </svg>
  `;

  const svgO = `
    <svg class="o" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" stroke="white" stroke-width="10" stroke-linecap="round"/>
    </svg>
  `;

  const createCell = (cell, rowBoi, { row, col }) => {
    const cellBoi = document.createElement("div");
    cellBoi.classList.add("cell");

    if (cell === "x") {
      const svgElement = createSVGElement(svgX);
      cellBoi.appendChild(svgElement);
    } else if (cell === "o") {
      const svgElement = createSVGElement(svgO);
      cellBoi.appendChild(svgElement);
    }

    // Onclick Listener
    cellBoi.addEventListener("click", () => {
      console.log("click");
      gameController.playRound(row, col);
    });
    rowBoi.appendChild(cellBoi);
  };

  const createRow = (row, rowCoord) => {
    const rowBoi = document.createElement("div");
    rowBoi.classList.add("row");
    row.forEach((cell, colCoord) => {
      createCell(cell, rowBoi, { row: rowCoord, col: colCoord });
    });
    return rowBoi;
  };

  const clearBoard = () => {
    const boardContainer = document.getElementById("drawnBoard");
    boardContainer.innerHTML = "";
  };

  const drawBoard = (currentBoard) => {
    clearBoard();

    const boardContainer = document.getElementById("drawnBoard");

    currentBoard.forEach((row, rowCoord) => {
      const rowBoi = createRow(row, rowCoord);
      boardContainer.appendChild(rowBoi);
    });

    if (lastClickedCell) {
      updateCell(lastClickedCell.row, lastClickedCell.col);
    }
  };

  return { drawBoard };
})();

userInterface.drawBoard(gameBoard.getCurrentBoard());

//   const drawBoard = (currentBoard) => {
//     clearBoard();

//     const boardContainer = document.getElementById("drawnBoard");
//     currentBoard.forEach((row, rowCoord) => {
//       boardContainer.appendChild(createRow(row, rowCoord));
//     });
//   };
//   return { drawBoard };
// })();

// userInterface.drawBoard(gameBoard.getCurrentBoard());
