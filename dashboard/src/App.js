import React, { useState } from 'react';
import './App.css';
import MyDashboard from './MyDashboard'; 

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="app-wrapper">
      {showDashboard ? (
        <MyDashboard goHome={() => setShowDashboard(false)} />
      ) : (
        <div className="start-page">
          <h1>ברוכה הבאה!</h1>
          <p>כדי להתחיל, לחצי על הכפתור למטה</p>
          <button onClick={() => setShowDashboard(true)} className="start-button">
            עבור לדשבורד שלי
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
