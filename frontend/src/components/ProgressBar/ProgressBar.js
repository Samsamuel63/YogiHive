import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProgressContainer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProgressTitle = styled.h2`
  font-size: 1.8rem;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
`;

const ProgressPercentage = styled.div`
  font-size: 1.2rem;
  color: #667eea;
  font-weight: 600;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const MilestoneContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Milestone = styled.div`
  position: relative;
  text-align: center;
  width: 60px;
`;

const MilestoneDot = styled.div`
  width: 12px;
  height: 12px;
  background: ${({ achieved }) => 
    achieved ? '#667eea' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 50%;
  margin: 0 auto 0.5rem;
  position: relative;
  z-index: 1;
`;

const MilestoneLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
`;

const ProgressBar = ({ progress, milestones }) => {
  return (
    <ProgressContainer>
      <ProgressHeader>
        <ProgressTitle>Journey Progress</ProgressTitle>
        <ProgressPercentage>{progress}%</ProgressPercentage>
      </ProgressHeader>
      <ProgressBarWrapper>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </ProgressBarWrapper>
      <MilestoneContainer>
        {milestones.map((milestone, index) => (
          <Milestone key={index}>
            <MilestoneDot achieved={progress >= milestone.percentage} />
            <MilestoneLabel>{milestone.label}</MilestoneLabel>
          </Milestone>
        ))}
      </MilestoneContainer>
    </ProgressContainer>
  );
};

export default ProgressBar; 