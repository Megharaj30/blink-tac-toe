import React, { useState } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);
  const [isTie, setIsTie] = useState(false);

  const getEmoji = (isPlayerOneTurn) => (isPlayerOneTurn ? "🐶" : "🍕");

  const handleCellClick = (index) => {
    if (board[index] || winner || isTie) return;

    const newBoard = [...board];
    newBoard[index] = getEmoji(isPlayerOneTurn);

    setBoard(newBoard);
    setIsPlayerOneTurn(!isPlayerOneTurn);
    checkWinner(newBoard);
  };

  const checkWinner = (board) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        setWinner(board[a]);
        setWinningCells([a, b, c]);
        updateScore(board[a]);
        triggerVictoryAnimation();
        setIsTie(false);
        return;
      }
    }

    if (board.every((cell) => cell !== null)) {
      setIsTie(true);
      setWinner(null);
      setWinningCells([]);
    } else {
      setIsTie(false);
    }
  };

  const updateScore = (winner) => {
    if (winner === "🐶") {
      setPlayerOneScore((prev) => prev + 1);
    } else if (winner === "🍕") {
      setPlayerTwoScore((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsTie(false);
    setIsPlayerOneTurn(true);
    setWinningCells([]);
    setShowVictoryAnimation(false);
  };

  const handleRestartAll = () => {
    handleReset();
    setPlayerOneScore(0);
    setPlayerTwoScore(0);
  };

  const triggerVictoryAnimation = () => {
    setShowVictoryAnimation(true);
    setTimeout(() => setShowVictoryAnimation(false), 3000);
  };

  return (
    <div className="game-page">
      <div className="background-animations">
        <span className="floating-symbol dog">🐶</span>
        <span className="floating-symbol pizza">🍕</span>
        <span className="floating-symbol paw">🐾</span>
        <span className="floating-symbol dog small">🐶</span>
        <span className="floating-symbol pizza small">🍕</span>
        <span className="floating-symbol paw small">🐾</span>
      </div>

      <h1 className="game-title">Blink Tac Toe</h1>

      {(showVictoryAnimation && winner) && (
        <div className="victory-overlay">
          <div className="victory-message">{winner} Wins!</div>
        </div>
      )}

      {isTie && (
        <div className="victory-overlay tie">
          <div className="victory-message">It's a Tie! Please play again.</div>
        </div>
      )}

      <div className="game-wrapper">
        <div className="game-board">
          {board.map((cell, index) => (
            <div
              key={index}
              className={`game-cell ${winningCells.includes(index) ? "winning-cell" : ""}`}
              onClick={() => handleCellClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>

        <div className="scoreboard-wrapper">
          <table className="scoreboard">
            <thead>
              <tr>
                <th>Player</th>
                <th>Emoji</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="player1">
                <td>Player 1</td>
                <td role="img" aria-label="dog emoji">🐶</td>
                <td>{playerOneScore}</td>
              </tr>
              <tr className="player2">
                <td>Player 2</td>
                <td role="img" aria-label="pizza emoji">🍕</td>
                <td>{playerTwoScore}</td>
              </tr>
            </tbody>
          </table>

          <div className="buttons-container">
            {(winner || isTie) && (
              <button className="reset-button" onClick={handleReset}>
                Play Again
              </button>
            )}
            <button className="restart-all-button" onClick={handleRestartAll}>
              Restart All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
