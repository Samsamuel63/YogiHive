import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  LinearProgress,
  Tooltip,
  IconButton,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion, AnimatePresence } from 'framer-motion';

const EveningStretching = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const stretches = [
    {
      title: "Neck and Shoulder Release",
      duration: 60,
      instructions: [
        "Sit comfortably with a straight spine",
        "Gently roll your shoulders backward 5 times",
        "Roll your shoulders forward 5 times",
        "Tilt your head to the right, hold for 15 seconds",
        "Tilt your head to the left, hold for 15 seconds",
        "Gently roll your head in circles, 5 times each direction"
      ],
      benefits: "Releases tension in neck and shoulders"
    },
    {
      title: "Cat-Cow Stretch",
      duration: 60,
      instructions: [
        "Start on your hands and knees",
        "Inhale: Drop your belly, lift your chest and gaze (Cow)",
        "Exhale: Round your spine, tuck your chin (Cat)",
        "Move slowly between positions",
        "Coordinate breath with movement",
        "Repeat 10 times"
      ],
      benefits: "Improves spine flexibility and relieves back tension"
    },
    {
      title: "Child's Pose",
      duration: 60,
      instructions: [
        "Kneel on the floor, big toes touching",
        "Sit back on your heels",
        "Extend your arms forward",
        "Rest your forehead on the mat",
        "Breathe deeply",
        "Hold for 1 minute"
      ],
      benefits: "Calms the mind and releases back tension"
    },
    {
      title: "Legs Up the Wall",
      duration: 120,
      instructions: [
        "Lie on your back near a wall",
        "Swing your legs up the wall",
        "Keep your buttocks close to the wall",
        "Flex and point your feet",
        "Close your eyes",
        "Hold for 2 minutes"
      ],
      benefits: "Reduces leg swelling and calms the nervous system"
    },
    {
      title: "Final Relaxation",
      duration: 60,
      instructions: [
        "Lie on your back",
        "Arms at sides, palms up",
        "Legs slightly apart",
        "Close your eyes",
        "Focus on your breath",
        "Let your body completely relax"
      ],
      benefits: "Promotes deep relaxation and better sleep"
    }
  ];

  const handleStretchingComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    
    // Save completion status
    localStorage.setItem('stretchingLastCompleted', new Date().toDateString());
    
    // Update challenge progress
    const taskId = 5; // Evening Stretching is task 5
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

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (activeStep < stretches.length - 1) {
        handleNext();
      } else {
        handleStretchingComplete();
      }
    }
  }, [isActive, timeLeft, activeStep]);

  const handleStart = () => {
    setIsActive(true);
    if (timeLeft === 0) {
      setTimeLeft(stretches[activeStep].duration);
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleNext = () => {
    if (activeStep < stretches.length - 1) {
      setActiveStep(prev => prev + 1);
      setTimeLeft(stretches[activeStep + 1].duration);
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setTimeLeft(0);
    setIsActive(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = stretches[activeStep] ? ((stretches[activeStep].duration - timeLeft) / stretches[activeStep].duration) * 100 : 0;

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
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  borderRadius: '16px',
                  textAlign: 'center'
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
                  🌙 Evening Stretching
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

                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  align="center"
                  sx={{ mb: 4 }}
                >
                  Unwind and release tension before sleep
                </Typography>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={stretches[activeStep]?.title || 'complete'}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {!isCompleted ? (
                      <>
                        <Typography variant="h5" gutterBottom>
                          {stretches[activeStep]?.title}
                        </Typography>

                        <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
                          Benefits: {stretches[activeStep]?.benefits}
                        </Typography>

                        <Box sx={{ textAlign: 'left', mb: 4 }}>
                          {stretches[activeStep]?.instructions.map((item, i) => (
                            <Typography 
                              key={i}
                              variant="body2"
                              sx={{
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                '&:before': {
                                  content: '"•"',
                                  marginRight: 1,
                                  color: 'primary.main'
                                }
                              }}
                            >
                              {item}
                            </Typography>
                          ))}
                        </Box>

                        <Box sx={{ position: 'relative', my: 6 }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ 
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4
                              }
                            }}
                          />

                          <Typography 
                            variant="h4"
                            sx={{
                              mt: 2,
                              fontFamily: 'monospace',
                              fontWeight: 'light'
                            }}
                          >
                            {formatTime(timeLeft)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
                          <Tooltip title={isActive ? "Pause" : "Start"}>
                            <IconButton
                              onClick={isActive ? handlePause : handleStart}
                              sx={{ 
                                width: 64,
                                height: 64,
                                backgroundColor: isActive ? 'secondary.main' : 'primary.main',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: isActive ? 'secondary.dark' : 'primary.dark',
                                }
                              }}
                            >
                              {isActive ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Next Stretch">
                            <IconButton
                              onClick={handleNext}
                              disabled={activeStep >= stretches.length - 1}
                              sx={{ 
                                width: 64,
                                height: 64,
                                backgroundColor: 'grey.200',
                                '&:hover': {
                                  backgroundColor: 'grey.300',
                                }
                              }}
                            >
                              <SkipNextIcon fontSize="large" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Restart">
                            <IconButton
                              onClick={handleReset}
                              sx={{
                                width: 64,
                                height: 64,
                                backgroundColor: 'grey.200',
                                '&:hover': {
                                  backgroundColor: 'grey.300',
                                }
                              }}
                            >
                              <RestartAltIcon fontSize="large" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ py: 6 }}>
                        <Typography variant="h5" gutterBottom>
                          🎉 Great job completing your evening stretches!
                        </Typography>

                        <Button 
                          variant="contained" 
                          onClick={handleReset}
                          startIcon={<RestartAltIcon />}
                          sx={{ mt: 3 }}
                        >
                          Start Over
                        </Button>
                      </Box>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );
};

export default EveningStretching;