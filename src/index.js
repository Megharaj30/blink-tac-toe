// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import './index.css'; // Global CSS (optional)
import App from './App'; // Import the App component

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
