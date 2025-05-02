import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const ProgressContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.9)',
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 16,
  borderRadius: 8,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 8,
    background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
    boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
  },
}));

const ChallengeProgress = ({ progress }) => {
  const totalTasks = 5; // Assuming 5 tasks per day
  const percentage = (progress / totalTasks) * 100;

  return (
    <ProgressContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h6" gutterBottom sx={{ 
          color: '#2c3e50', 
          fontWeight: 'bold',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          Today's Progress
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <StyledLinearProgress variant="determinate" value={percentage} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500
          }}>
            {Math.round(percentage)}%
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ 
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 500
        }}>
          {progress} of {totalTasks} tasks completed
        </Typography>
      </motion.div>
    </ProgressContainer>
  );
};

export default ChallengeProgress; 