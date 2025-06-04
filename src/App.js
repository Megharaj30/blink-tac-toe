// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));  // 3x3 grid
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);  // Player 1 starts
  const [winner, setWinner] = useState(null);  // Winner tracking
  const [winningCells, setWinningCells] = useState([]);  // Cells that make the winning line
  const [playerOneScore, setPlayerOneScore] = useState(0);  // Player 1 score
  const [playerTwoScore, setPlayerTwoScore] = useState(0);  // Player 2 score
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);  // Trigger animation

  const getEmoji = (isPlayerOneTurn) => {
    return isPlayerOneTurn ? "🐶" : "🍕"; // Player 1 gets 🐶 and Player 2 gets 🍕
  };

  const handleCellClick = (index) => {
    // If the cell is already filled or there's a winner, return
    if (board[index] || winner) return;

    const newBoard = [...board];
    const emoji = getEmoji(isPlayerOneTurn);
    newBoard[index] = emoji;
    
    setBoard(newBoard);
    setIsPlayerOneTurn(!isPlayerOneTurn);  // Toggle turn
    checkWinner(newBoard);  // Check for winner after the move
  };

  const checkWinner = (board) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]  // Diagonals
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);  // Set winner
        setWinningCells([a, b, c]);  // Track the winning cells
        updateScore(board[a]); // Update the score
        triggerVictoryAnimation(); // Trigger victory animation
        break;
      }
    }
  };

  const updateScore = (winner) => {
    if (winner === "🐶") {
      setPlayerOneScore(playerOneScore + 1);
    } else if (winner === "🍕") {
      setPlayerTwoScore(playerTwoScore + 1);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));  // Reset board
    setWinner(null);  // Reset winner
    setIsPlayerOneTurn(true);  // Player 1 starts
    setWinningCells([]);  // Reset winning cells
    setShowVictoryAnimation(false); // Hide victory animation on reset
  };

  const triggerVictoryAnimation = () => {
    setShowVictoryAnimation(true);
    setTimeout(() => {
      setShowVictoryAnimation(false); // Hide after animation ends
    }, 3000); // Animation duration is 3 seconds
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Blink Tac Toe</h1>

      {/* Full-Screen Victory Animation */}
      {showVictoryAnimation && (
        <div className="victory-overlay">
          <div className="victory-message">{winner} Wins!</div>
        </div>
      )}

      {/* Game Board */}
      <div className="game-board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`game-cell ${winningCells.includes(index) ? 'winning-cell' : ''}`}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      {winner && <div className="winner-message">{winner} Wins!</div>}
      <div className="scoreboard">
        <div>Player 1 (🐶): {playerOneScore}</div>
        <div>Player 2 (🍕): {playerTwoScore}</div>
      </div>

      <button className="reset-button" onClick={handleReset}>Play Again</button>
    </div>
  );
}

export default App;
