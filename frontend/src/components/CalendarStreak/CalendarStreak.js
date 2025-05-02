import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFire, FaCalendarAlt } from 'react-icons/fa';

const CalendarContainer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StreakInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StreakCount = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayCell = styled(motion.div)`
  aspect-ratio: 1;
  background: ${({ completed }) => 
    completed ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.5)'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ completed }) => completed ? 'white' : '#718096'};
  font-weight: ${({ completed }) => completed ? '600' : '400'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ completed }) => 
      completed ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  }
`;

const DayLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const CalendarStreak = ({ streakData }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || 0;
  const completedDays = streakData?.completedDays || [];

  // Generate last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date,
      completed: completedDays.includes(date.toISOString().split('T')[0])
    };
  });

  return (
    <CalendarContainer>
      <Header>
        <Title>
          <FaCalendarAlt />
          Daily Streak
        </Title>
        <StreakInfo>
          <StreakCount>
            <FaFire />
            {currentStreak} days
          </StreakCount>
          <div>
            Longest: {longestStreak} days
          </div>
        </StreakInfo>
      </Header>
      
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {days.map(day => (
            <DayLabel key={day}>{day}</DayLabel>
          ))}
        </div>
        <CalendarGrid>
          {last30Days.map((day, index) => (
            <DayCell
              key={index}
              completed={day.completed}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              whileHover={{ scale: 1.1 }}
            >
              {day.date.getDate()}
            </DayCell>
          ))}
        </CalendarGrid>
      </div>
    </CalendarContainer>
  );
};

export default CalendarStreak; 