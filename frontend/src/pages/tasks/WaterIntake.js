import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  LinearProgress,
  Card,
  CardContent,
  Tooltip,
  Fade,
  Slider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { motion, AnimatePresence } from 'framer-motion';

const WaterIntake = () => {
  const DAILY_GOAL = 2000; // 2000ml or 2L
  const GLASS_SIZE = 250; // 250ml per glass

  const [currentIntake, setCurrentIntake] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if water intake was tracked today
    const lastCompletionDate = localStorage.getItem('waterIntakeLastCompleted');
    const savedIntake = localStorage.getItem('waterIntakeAmount');
    const today = new Date().toDateString();
    
    if (lastCompletionDate !== today) {
      setIsCompleted(false);
      setCurrentIntake(0);
      localStorage.removeItem('waterIntakeLastCompleted');
      localStorage.removeItem('waterIntakeAmount');
    } else {
      setCurrentIntake(parseInt(savedIntake) || 0);
      setIsCompleted(true);
    }
  }, []);

  useEffect(() => {
    // Check if goal is reached
    if (currentIntake >= DAILY_GOAL && !isCompleted) {
      handleGoalComplete();
    }

    // Save current intake
    localStorage.setItem('waterIntakeAmount', currentIntake.toString());
    setLastUpdated(new Date().toLocaleTimeString());
  }, [currentIntake]);

  const handleGoalComplete = () => {
    setIsCompleted(true);
    
    // Save completion status
    localStorage.setItem('waterIntakeLastCompleted', new Date().toDateString());
    
    // Update challenge progress
    const taskId = 3; // Water Intake is task 3
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    const currentDay = localStorage.getItem('currentDay');
    
    if (currentDay) {
      const completedTasks = savedCompletedTasks ? JSON.parse(savedCompletedTasks) : {};
      const taskKey = `day${currentDay}_task${taskId}`;
      
      if (!completedTasks[taskKey]) {
        completedTasks[taskKey] = true;
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        
        const savedProgress = localStorage.getItem('challengeProgress');
        const newProgress = (parseInt(savedProgress) || 0) + 1;
        localStorage.setItem('challengeProgress', newProgress.toString());

        // Dispatch event to notify progress update
        window.dispatchEvent(new Event('challengeProgressUpdated'));
      }
    }
  };

  const handleAddWater = (amount) => {
    if (currentIntake + amount <= DAILY_GOAL * 1.5) { // Allow up to 150% of daily goal
      setCurrentIntake(prev => prev + amount);
    }
  };

  const handleRemoveWater = (amount) => {
    if (currentIntake - amount >= 0) {
      setCurrentIntake(prev => prev - amount);
    }
  };

  const handleReset = () => {
    setCurrentIntake(0);
    setIsCompleted(false);
    localStorage.removeItem('waterIntakeLastCompleted');
    localStorage.removeItem('waterIntakeAmount');
  };

  const getProgressColor = (progress) => {
    if (progress < 33) return 'error.main';
    if (progress < 66) return 'warning.main';
    return 'success.main';
  };

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ py: 4 }}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 4 }}
          >
            Back to Dashboard
          </Button>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4,
                  borderRadius: '16px',
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                }}
              >
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  align="center"
                  component={motion.h4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  💧 Daily Water Intake
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RestartAltIcon />}
                    onClick={() => {
                      handleReset();
                      localStorage.removeItem('completedTasks');
                      localStorage.removeItem('challengeProgress');
                      window.location.reload();
                    }}
                    sx={{
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'white'
                      }
                    }}
                  >
                    Reset Progress
                  </Button>
                </Box>

                <Box sx={{ mt: 6, mb: 4 }}>
                  <Box sx={{ position: 'relative', height: 20, mb: 4 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(currentIntake / DAILY_GOAL) * 100}
                      sx={{
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 10,
                          backgroundColor: getProgressColor((currentIntake / DAILY_GOAL) * 100)
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      {currentIntake}ml / {DAILY_GOAL}ml
                    </Typography>
                  </Box>

                  <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                      <Card sx={{ minWidth: 200, textAlign: 'center' }}>
                        <CardContent>
                          <Typography variant="h3" component="div" color="primary">
                            {Math.floor(currentIntake / GLASS_SIZE)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Glasses (250ml each)
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item>
                      <Card sx={{ minWidth: 200, textAlign: 'center' }}>
                        <CardContent>
                          <Typography variant="h3" component="div" color="primary">
                            {((currentIntake / DAILY_GOAL) * 100).toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            of Daily Goal
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Quick Add
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleAddWater(GLASS_SIZE)}
                          startIcon={<WaterDropIcon />}
                          disabled={isCompleted}
                          sx={{
                            borderRadius: '12px',
                            backgroundColor: 'primary.light',
                            '&:hover': {
                              backgroundColor: 'primary.main'
                            }
                          }}
                        >
                          Add Glass (250ml)
                        </Button>
                        <Tooltip title="Reset">
                          <IconButton
                            onClick={handleReset}
                            sx={{ 
                              backgroundColor: 'grey.200',
                              '&:hover': {
                                backgroundColor: 'grey.300',
                              }
                            }}
                          >
                            <RestartAltIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: 'success.light',
                        color: 'white',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                      }}
                    >
                      <Typography variant="h6">
                        ✨ Congratulations! You've reached your water intake goal
                      </Typography>
                    </Paper>
                  </motion.div>
                )}

                {lastUpdated && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ display: 'block', textAlign: 'center', mt: 2 }}
                  >
                    Last updated: {lastUpdated}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Custom Amount
                </Typography>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fine-tune your intake:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                      onClick={() => handleRemoveWater(50)}
                      disabled={currentIntake <= 0}
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1">
                      50ml
                    </Typography>
                    <IconButton
                      onClick={() => handleAddWater(50)}
                      disabled={isCompleted}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Benefits of Staying Hydrated
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Maintains body temperature
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Protects sensitive tissues
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Lubricates joints
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Removes waste through urination
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Tips
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Drink a glass of water when you wake up
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Keep a water bottle at your desk
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Set reminders throughout the day
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );
};

export default WaterIntake; 