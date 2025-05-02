import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
`;

const Circle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const AuthBackground = () => {
  const circles = [
    { size: 300, x: '10%', y: '20%', duration: 20 },
    { size: 200, x: '80%', y: '30%', duration: 25 },
    { size: 150, x: '30%', y: '60%', duration: 30 },
    { size: 250, x: '70%', y: '70%', duration: 35 },
  ];

  return (
    <BackgroundContainer>
      {circles.map((circle, index) => (
        <Circle
          key={index}
          initial={{ 
            x: circle.x,
            y: circle.y,
            scale: 0.8,
            opacity: 0.3
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.5, 0.3],
            x: [
              circle.x,
              `calc(${circle.x} + 50px)`,
              `calc(${circle.x} - 30px)`,
              circle.x
            ],
            y: [
              circle.y,
              `calc(${circle.y} - 30px)`,
              `calc(${circle.y} + 50px)`,
              circle.y
            ]
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: circle.size,
            height: circle.size,
          }}
        />
      ))}
    </BackgroundContainer>
  );
};

export default AuthBackground; 