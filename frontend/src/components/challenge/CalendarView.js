import React from 'react';
import { Box, Typography, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useAuth } from '../../context/AuthContext';

const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #6B8DD6 0%, #4B6CB7 100%)',
  color: 'white',
  textAlign: 'center',
  boxShadow: '0 4px 15px rgba(107, 141, 214, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    zIndex: 1,
  }
}));

const CalendarDay = styled(Box)(({ theme, completed, today }) => ({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  margin: '2px',
  background: completed
    ? 'rgba(76, 175, 80, 0.85)'
    : today
      ? 'rgba(255,255,255,0.95)'
      : 'rgba(255, 255, 255, 0.2)',
  color: completed ? 'white' : today ? '#4B6CB7' : 'white',
  fontWeight: today ? 'bold' : 'normal',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: today ? '2px solid #667eea' : 'none',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: completed ? '0 0 8px #48bb78' : '0 0 8px #718096',
  }
}));

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let dayOfWeek = firstDay.getDay();
  // Fill initial empty days
  for (let i = 0; i < dayOfWeek; i++) week.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(d);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length) matrix.push(week);
  return matrix;
}

const CalendarView = () => {
  const { user } = useAuth();
  const userKey = user?.email || 'guest';
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthMatrix = getMonthMatrix(year, month);

  // Gather all completed days for this user
  const allTimeCompletedTasks = JSON.parse(localStorage.getItem(`allTimeCompletedTasks_${userKey}`) || '{}');
  // Map: dateString (e.g. '2024-06-01') => true if all 5 tasks completed
  const completedDays = {};
  Object.keys(allTimeCompletedTasks).forEach(key => {
    // key: YYYY-MM-DD_task{M}
    const match = key.match(/^(\d{4}-\d{2}-\d{2})_task(\d)$/);
    if (match) {
      const dateString = match[1];
      completedDays[dateString] = (completedDays[dateString] || 0) + 1;
    }
  });
  // A day is completed if all 5 tasks are done
  Object.keys(completedDays).forEach(date => {
    completedDays[date] = completedDays[date] >= 5;
  });

  return (
    <CalendarContainer elevation={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 2,
          position: 'relative',
          zIndex: 2
        }}>
          <CalendarMonthIcon sx={{ 
            fontSize: 30, 
            mr: 1,
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
          }} />
          <Typography variant="h6" sx={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            Your Monthly Progress
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          position: 'relative',
          zIndex: 2
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <Typography 
              key={day}
              variant="caption"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600
              }}
            >
              {day}
            </Typography>
          ))}
          {monthMatrix.map((week, i) => (
            week.map((date, j) => {
              if (!date) return <Box key={`empty-${i}-${j}`} />;
              const dateObj = new Date(year, month, date);
              const dateString = dateObj.toISOString().split('T')[0];
              const isToday = dateObj.toDateString() === today.toDateString();
              const completed = completedDays[dateString];
              return (
                <Tooltip
                  key={dateString}
                  title={completed ? 'Completed' : 'Not Completed'}
                  arrow
                  placement="top"
                >
                  <CalendarDay completed={completed} today={isToday}>
                    {date}
                  </CalendarDay>
                </Tooltip>
              );
            })
          ))}
        </Box>
      </motion.div>
    </CalendarContainer>
  );
};

export default CalendarView; 