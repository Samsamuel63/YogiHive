import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const StreakContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
  color: 'white',
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
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

const StreakCounter = ({ streak }) => {
  const streakText = streak >= 100 ? '100+' : streak.toString();

  return (
    <StreakContainer elevation={3}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
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
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <LocalFireDepartmentIcon sx={{ 
              fontSize: 40, 
              mr: 1,
              filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
            }} />
          </motion.div>
          <Typography variant="h4" component="div" sx={{ 
            fontWeight: 'bold',
            fontFamily: 'Montserrat, sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {streakText}
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom sx={{ 
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}>
          Day Streak
        </Typography>
        <Typography variant="body2" sx={{ 
          fontFamily: 'Montserrat, sans-serif',
          opacity: 0.9,
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}>
          {streak >= 100 
            ? "Incredible! You're a true champion!" 
            : "Keep going! You're building an amazing habit"}
        </Typography>
      </motion.div>
    </StreakContainer>
  );
};

export default StreakCounter; 