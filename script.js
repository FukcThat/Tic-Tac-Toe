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

var array = [];

const player = (name, marker) => {
  return { name, marker };
};

const gameController = (() => {
  let lastClickedCell = { row: null, col: null };
  let player1 = null;
  let player2 = null;
  let currentPlayer = null;

  const init = (player1NameValue, player2NameValue) => {
    player1 = player(player1NameValue, "x");
    player2 = player(player2NameValue, "o");
    currentPlayer = player1;

    let turnIndicator = document.querySelector("#turnIndicator");
    turnIndicator.textContent = `It's ${currentPlayer.name}'s turn`;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;

    console.log(currentPlayer);

    let turnIndicator = document.querySelector("#turnIndicator");
    turnIndicator.textContent = `It's ${currentPlayer.name}'s turn`;
  };

  const playRound = (row, col) => {
    if (currentPlayer == null) currentPlayer = player1;
    if (gameBoard.makeMove(row, col, currentPlayer.marker)) {
      lastClickedCell = { row: row, col: col };

      gameBoard.printBoard();
      userInterface.drawBoard(gameBoard.getCurrentBoard(), lastClickedCell);
      if (checkWinner(currentPlayer.marker)) {
        const WinnerText = document.querySelector("#winnerText");
        WinnerText.textContent = `${currentPlayer.name} wins!`;

        const EndGameScreenSection = document.querySelector("#endGameScreen");
        EndGameScreenSection.classList.remove("hidden");
        EndGameScreenSection.classList.toggle("flex");

        const GameScreenSection = document.querySelector("#GameScreen");
        GameScreenSection.classList.toggle("flex");
        GameScreenSection.classList.toggle("hidden");

        return;
      } else if (checkTie()) {
        const WinnerText = document.querySelector("#winnerText");
        WinnerText.textContent = `Neither of you managed to win!`;

        const EndGameScreenSection = document.querySelector("#endGameScreen");
        EndGameScreenSection.classList.remove("hidden");
        EndGameScreenSection.classList.toggle("flex");

        const GameScreenSection = document.querySelector("#GameScreen");
        GameScreenSection.classList.toggle("flex");
        GameScreenSection.classList.toggle("hidden");
        return;
      }
      switchPlayer();
    } else {
      window.alert("That's illegal. Try again.");
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

  return {
    playRound,
    getCurrentPlayer: () => currentPlayer,
    checkTie,
    lastClickedCell,
    init,
  };
})();

const userInterface = (() => {
  const onStartGameBtnClick = () => {
    // wanna make sure that name inputs are not empty
    const player1NameInput = document.querySelector("#p1sNameInput");
    const player2NameInput = document.querySelector("#p2NameInput");

    if (player1NameInput.value == "" && player2NameInput.value == "")
      return window.alert("No name, no game.");

    // get the name inputs and set them to be the names of the respective players
    gameController.init(player1NameInput.value, player2NameInput.value);
    // hide the manu section
    const HomeScreenSection = document.querySelector("#HomeScreen");
    HomeScreenSection.classList.add("hidden");
    HomeScreenSection.classList.toggle("flex");

    // show the game section
    const GameScreenSection = document.querySelector("#GameScreen");
    GameScreenSection.classList.toggle("flex");
    GameScreenSection.classList.toggle("hidden");

    // run the first drawBoard call
    drawBoard(gameBoard.getCurrentBoard(), {
      row: null,
      col: null,
    });
  };

  // const onHomeBtnClick = () => {
  //   clearBoard();

  //   const HomeScreenSection = document.querySelector("#HomeScreen");
  //   HomeScreenSection.classList.remove("hidden");
  //   HomeScreenSection.classList.toggle("flex");

  //   const GameScreenSection = document.querySelector("#GameScreen");
  //   GameScreenSection.classList.toggle("flex");
  //   GameScreenSection.classList.toggle("hidden");
  // };

  // Helper

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

  const createCell = (cell, rowBoi, { row, col }, lastClickedCell) => {
    const cellBoi = document.createElement("div");
    cellBoi.classList.add("cell");

    if (row === lastClickedCell.row && col === lastClickedCell.col) {
      if (cell === "x") {
        const svgElement = createSVGElement(svgX);
        cellBoi.appendChild(svgElement);
      } else if (cell === "o") {
        const svgElement = createSVGElement(svgO);
        cellBoi.appendChild(svgElement);
      }
    } else {
      if (cell !== " ") {
        cellBoi.classList.add("finished" + cell);
      }
    }

    // Onclick Listener
    cellBoi.addEventListener("click", () => {
      console.log("click");
      gameController.playRound(row, col);
    });
    rowBoi.appendChild(cellBoi);
  };

  const createRow = (row, rowCoord, lastClickedCell) => {
    const rowBoi = document.createElement("div");
    rowBoi.classList.add("row");
    row.forEach((cell, colCoord) => {
      createCell(
        cell,
        rowBoi,
        { row: rowCoord, col: colCoord },
        lastClickedCell
      );
    });
    return rowBoi;
  };

  const clearBoard = () => {
    const boardContainer = document.getElementById("drawnBoard");
    boardContainer.innerHTML = "";
  };

  const drawBoard = (currentBoard, lastClickedCell) => {
    console.log(lastClickedCell);
    clearBoard();

    const boardContainer = document.getElementById("drawnBoard");

    currentBoard.forEach((row, rowCoord) => {
      const rowBoi = createRow(row, rowCoord, lastClickedCell);
      boardContainer.appendChild(rowBoi);
    });
  };

  return { onStartGameBtnClick, drawBoard };
})();

document.querySelector("#playBtn").addEventListener("click", () => {
  userInterface.onStartGameBtnClick();
});

document.querySelector("#homeBtn").addEventListener("click", () => {
  userInterface.onHomeBtnClick();
});
