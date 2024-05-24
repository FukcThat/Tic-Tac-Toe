const gameBoard = (() => {
  let board = [
    ["o", " ", " "],
    [" ", "x", " "],
    [" ", " ", "o"],
  ];

  const getCurrentBoard = () => board;

  const printBoard = () => {
    board.forEach((row) => {
      console.log(row.join(" | "));
    });
  };

  return { getCurrentBoard, printBoard };
})();

gameBoard.printBoard();
