import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import YogiJiChatbot from '../../components/YogiJiChatbot';
import YogiJiButton from '../../components/YogiJiButton';
import './Easy.css';

export default function EasyLevels() {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <h1 className="title">YogiHive</h1>
        <h2 className="subtitle">Yoga Journey - Easy Levels</h2>
      </header>

      {/* Levels Grid */}
      <div className="levels-grid">
        {levels.map((level) => (
          <button
            key={level}
            className="level-button"
            onClick={() => navigate(`/easy/level/${level}`)}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <YogiJiButton onClick={() => setShowChatbot(true)} />

      {showChatbot && (
        <YogiJiChatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
}