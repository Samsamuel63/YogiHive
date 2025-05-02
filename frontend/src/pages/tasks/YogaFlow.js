import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  Tooltip,
  Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { motion, AnimatePresence } from 'framer-motion';

const YogaFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per pose
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const yogaPoses = [
    {
      name: "Mountain Pose (Tadasana)",
      duration: 60,
      image: "/images/yoga/mountain-pose.jpg",
      instructions: [
        "Stand tall with feet together",
        "Arms at sides, palms forward",
        "Engage core and lengthen spine",
        "Breathe deeply and find balance"
      ]
    },
    {
      name: "Downward Dog (Adho Mukha Svanasana)",
      duration: 60,
      image: "/images/yoga/downward-dog.jpg",
      instructions: [
        "Start in plank position",
        "Lift hips toward ceiling",
        "Straighten arms and legs",
        "Press heels toward floor"
      ]
    },
    {
      name: "Warrior I (Virabhadrasana I)",
      duration: 60,
      image: "/images/yoga/warrior-1.jpg",
      instructions: [
        "Step one foot back",
        "Bend front knee 90 degrees",
        "Raise arms overhead",
        "Square hips to front"
      ]
    },
    {
      name: "Tree Pose (Vrksasana)",
      duration: 60,
      image: "/images/yoga/tree-pose.jpg",
      instructions: [
        "Stand on one leg",
        "Place foot on inner thigh",
        "Bring hands to heart",
        "Focus on fixed point"
      ]
    },
    {
      name: "Child's Pose (Balasana)",
      duration: 60,
      image: "/images/yoga/childs-pose.jpg",
      instructions: [
        "Kneel on mat",
        "Sit back on heels",
        "Extend arms forward",
        "Rest forehead on mat"
      ]
    }
  ];

  useEffect(() => {
    // Check if yoga was completed today
    const lastCompletionDate = localStorage.getItem('yogaLastCompleted');
    const today = new Date().toDateString();
    
    if (lastCompletionDate !== today) {
      setIsCompleted(false);
      setActiveStep(0);
      setTimeLeft(60);
      localStorage.removeItem('yogaLastCompleted');
    } else {
      setIsCompleted(true);
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            handleNextPose();
          }
          return timeLeft - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleNextPose = () => {
    if (activeStep === yogaPoses.length - 1) {
      handleYogaComplete();
    } else {
      setActiveStep(prev => prev + 1);
      setTimeLeft(60);
    }
  };

  const handleYogaComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    
    // Save completion status
    localStorage.setItem('yogaLastCompleted', new Date().toDateString());
    
    // Update challenge progress
    const taskId = 2; // Yoga Flow is task 2
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

  const handleReset = () => {
    setActiveStep(0);
    setTimeLeft(60);
    setIsActive(false);
    setIsCompleted(false);
    localStorage.removeItem('yogaLastCompleted');
  };

  const formatTime = (seconds) => {
    return `${seconds}s`;
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
                  🧘‍♀️ Daily Yoga Flow
                </Typography>

                <Box sx={{ mt: 4 }}>
                  <Card sx={{ mb: 4, borderRadius: '12px', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={yogaPoses[activeStep].image}
                      alt={yogaPoses[activeStep].name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {yogaPoses[activeStep].name}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={(1 - timeLeft/60) * 100}
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              backgroundColor: 'primary.main',
                            }
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                          {formatTime(timeLeft)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
                        <Tooltip title={isActive ? "Pause" : "Start"}>
                          <IconButton 
                            onClick={() => setIsActive(!isActive)}
                            disabled={isCompleted}
                            sx={{ 
                              width: 56,
                              height: 56,
                              backgroundColor: isActive ? 'secondary.main' : 'primary.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: isActive ? 'secondary.dark' : 'primary.dark',
                              },
                              '&:disabled': {
                                backgroundColor: 'grey.300',
                              }
                            }}
                          >
                            {isActive ? <PauseIcon /> : <PlayArrowIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Next Pose">
                          <IconButton
                            onClick={handleNextPose}
                            disabled={isCompleted}
                            sx={{ 
                              width: 56,
                              height: 56,
                              backgroundColor: 'primary.light',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'primary.main',
                              },
                              '&:disabled': {
                                backgroundColor: 'grey.300',
                              }
                            }}
                          >
                            <SkipNextIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset">
                          <IconButton
                            onClick={handleReset}
                            sx={{ 
                              width: 56,
                              height: 56,
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
                    </CardContent>
                  </Card>

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
                          ✨ Amazing! You've completed today's yoga flow
                        </Typography>
                      </Paper>
                    </motion.div>
                  )}
                </Box>
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
                  Pose Instructions
                </Typography>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {yogaPoses.map((pose, index) => (
                    <Step key={pose.name}>
                      <StepLabel>
                        <Typography variant="subtitle1">
                          {pose.name}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ mb: 2 }}>
                          {pose.instructions.map((instruction, i) => (
                            <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              • {instruction}
                            </Typography>
                          ))}
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );
};

export default YogaFlow; 