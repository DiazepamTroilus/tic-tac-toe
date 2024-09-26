'use strict';
const Gameboard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];
  const getBoard = () => board;
  const setMove = (index, marker) => {
    if (board[index] === '') {
      board[index] = marker;
      return true;
    }
    return false;
  };
  const reset = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    document.querySelector('.result-div').textContent = '';
    DisplayController.renderBoard();
  };
  return { getBoard, setMove, reset };
})();
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};
const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;
  const startGame = (player1Name, player2Name) => {
    players = [Player(player1Name, 'X'), Player(player2Name, 'O')];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.reset();
  };
  const playTurn = index => {
    if (gameOver) return;
    const currentPlayer = players[currentPlayerIndex];
    if (Gameboard.setMove(index, currentPlayer.getMarker())) {
      if (checkWinner()) {
        DisplayController.showResult(`${currentPlayer.getName()} wins!`);
        gameOver = true;
      } else if (Gameboard.getBoard().every(cell => cell !== '')) {
        DisplayController.showResult("It's a tie!");
        gameOver = true;
      } else {
        currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
      }
      DisplayController.renderBoard();
    }
  };
  const checkWinner = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winningCombos.some(combo =>
      combo.every(
        index =>
          Gameboard.getBoard()[index] ===
          players[currentPlayerIndex].getMarker()
      )
    );
  };
  return { startGame, playTurn };
})();
const DisplayController = (() => {
  const boardDiv = document.querySelector('.game-board');
  const renderBoard = () => {
    boardDiv.innerHTML = '';
    Gameboard.getBoard().forEach((cell, idx) => {
      const cellDiv = document.createElement('div');
      cellDiv.textContent = cell;
      cellDiv.addEventListener('click', () => GameController.playTurn(idx));
      boardDiv.appendChild(cellDiv);
    });
  };
  const showResult = message => {
    const resultDiv = document.querySelector('.result-div');
    resultDiv.textContent = message;
  };
  return { renderBoard, showResult };
})();
document.querySelector('.start-game').addEventListener('click', () => {
  const player1 = prompt("Enter Player 1's name:");
  const player2 = prompt("Enter Player 2's name:");
  GameController.startGame(player1, player2);
});
document.querySelector('.reset').addEventListener('click', Gameboard.reset);
