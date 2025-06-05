import React, { useState } from "react";
import "./App.css";

const emojiCategories = {
  Animals: ["🐶", "🐱", "🐵", "🐰"],
  Food: ["🍕", "🍟", "🍔", "🍩"],
  Sports: ["⚽️", "🏀", "🏈", "🎾"],
};

function App() {
  const [playerOneCategory, setPlayerOneCategory] = useState(null);
  const [playerTwoCategory, setPlayerTwoCategory] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [playerOnePositions, setPlayerOnePositions] = useState([]);
  const [playerTwoPositions, setPlayerTwoPositions] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const getRandomEmoji = (category) => {
    const emojis = emojiCategories[category];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const canStart = playerOneCategory && playerTwoCategory && playerOneCategory !== playerTwoCategory;

  const handleCellClick = (index) => {
    if (!isGameStarted || winner || board[index] !== null) return;

    const isP1 = isPlayerOneTurn;
    const currentPositions = isP1 ? playerOnePositions : playerTwoPositions;
    const category = isP1 ? playerOneCategory : playerTwoCategory;

    // Prevent reuse of the removed cell
    if (currentPositions.length === 3) {
      const oldestPos = currentPositions[0].pos;
      if (index === oldestPos) {
        alert("Cannot place on the cell where your oldest emoji was removed!");
        return;
      }
    }

    const newEmoji = getRandomEmoji(category);
    const newBoard = [...board];
    const updatedPositions = [...currentPositions];

    // If 3 emojis are already on the board, remove the oldest
    if (currentPositions.length === 3) {
      const removedIndex = updatedPositions[0].pos;
      newBoard[removedIndex] = null;
      updatedPositions.shift();
    }

    newBoard[index] = newEmoji;
    updatedPositions.push({ pos: index, emoji: newEmoji });

    setBoard(newBoard);

    if (isP1) {
      setPlayerOnePositions(updatedPositions);
      checkWinner(updatedPositions, true);
    } else {
      setPlayerTwoPositions(updatedPositions);
      checkWinner(updatedPositions, false);
    }

    if (!winner) setIsPlayerOneTurn(!isPlayerOneTurn);
  };

  const checkWinner = (positions, isP1) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    const occupied = positions.map((pos) => pos.pos);

    for (let line of lines) {
      if (line.every((cell) => occupied.includes(cell))) {
        setWinner(isP1 ? "Player 1" : "Player 2");
        setWinningCells(line);
        return;
      }
    }
  };

  const handlePlayAgain = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningCells([]);
    setPlayerOnePositions([]);
    setPlayerTwoPositions([]);
    setIsPlayerOneTurn(true);
  };

  const handleRestartAll = () => {
    handlePlayAgain();
    setPlayerOneCategory(null);
    setPlayerTwoCategory(null);
    setIsGameStarted(false);
  };

  if (!isGameStarted) {
    return (
      <div className="category-selection acrylic-bg">
        <h1 className="title">Choose Emoji Categories</h1>
        <div className="category-container">
          <div className="player-selection">
            <h2>Player 1</h2>
            <div className="buttons-grid">
              {Object.keys(emojiCategories).map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${playerOneCategory === cat ? "selected" : ""}`}
                  onClick={() => setPlayerOneCategory(cat)}
                >
                  <span className="cat-name">{cat}</span>
                  <span className="cat-emojis">{emojiCategories[cat].join(" ")}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="player-selection">
            <h2>Player 2</h2>
            <div className="buttons-grid">
              {Object.keys(emojiCategories).map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${playerTwoCategory === cat ? "selected" : ""}`}
                  onClick={() => setPlayerTwoCategory(cat)}
                >
                  <span className="cat-name">{cat}</span>
                  <span className="cat-emojis">{emojiCategories[cat].join(" ")}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {playerOneCategory && playerTwoCategory && playerOneCategory === playerTwoCategory && (
          <p className="warning-msg">Players must select different categories!</p>
        )}

        <button
          className={`start-btn ${canStart ? "active" : "disabled"}`}
          disabled={!canStart}
          onClick={() => canStart && setIsGameStarted(true)}
        >
          Start Game
        </button>

        <button className="help-btn" onClick={() => setShowHelp(true)}>
          How to Play?
        </button>

        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </div>
    );
  }

  return (
    <div className="game-page acrylic-bg">
      <header>
        <h1>Blink Tac Toe</h1>
        <div className="turn-indicator">
          Turn: {isPlayerOneTurn ? "Player 1" : "Player 2"}{" "}
          {isPlayerOneTurn ? emojiCategories[playerOneCategory][0] : emojiCategories[playerTwoCategory][0]}
        </div>
        <button className="help-btn" onClick={() => setShowHelp(true)}>?</button>
      </header>

      <div className="board-wrapper">
        <div className="game-board">
          {board.map((cell, idx) => (
            <div
              key={idx}
              className={`game-cell ${winningCells.includes(idx) ? "winning-cell animated-glow" : ""}`}
              onClick={() => handleCellClick(idx)}
            >
              {cell}
            </div>
          ))}
        </div>
      </div>

      {winner ? (
        <div className="victory-message animated-glow">
          🎉 {winner} Wins! 🎉
          <button onClick={handlePlayAgain} className="action-btn">Play Again</button>
          <button onClick={handleRestartAll} className="action-btn">Restart All</button>
        </div>
      ) : (
        <div className="buttons-container">
          <button onClick={handlePlayAgain} className="action-btn">Reset Board</button>
          <button onClick={handleRestartAll} className="action-btn">Restart All</button>
        </div>
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

function HelpModal({ onClose }) {
  return (
    <div className="help-modal-backdrop" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <h2>How to Play Blink Tac Toe</h2>
        <ul>
          <li>Select unique emoji categories for both players.</li>
          <li>The board is 3x3. Each player can have only 3 emojis on board.</li>
          <li>On your turn, place a random emoji in an empty cell.</li>
          <li>If you already have 3, your oldest emoji is removed (FIFO).</li>
          <li>You can't place on the removed cell immediately.</li>
          <li>Form a line of 3 emojis to win!</li>
        </ul>
        <button onClick={onClose} className="close-help-btn">Close</button>
      </div>
    </div>
  );
}

export default App;
