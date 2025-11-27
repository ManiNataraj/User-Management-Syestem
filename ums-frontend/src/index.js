import React from 'react';
// Import the correct rendering method based on React version
import { createRoot } from 'react-dom/client'; 
import './index.css'; // Optional: for global styles
import App from './App'; // Import the main App component

// Get the root element from index.html
const container = document.getElementById('root');
const root = createRoot(container); // Create a root 

// Initial render of the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Note: If you are using an older version of React (pre-v18), 
// the rendering syntax would be:
/*
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/