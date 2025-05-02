import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &::after {
    content: 'Chat with Yogi Ji';
    position: absolute;
    right: 70px;
    background: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 14px;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const YogiJiButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} aria-label="Chat with Yogi Ji">
      🧘‍♂️
    </Button>
  );
};

export default YogiJiButton; 