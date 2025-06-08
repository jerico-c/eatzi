import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; 
import './index.css';


const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Please check your index.html file.");
}