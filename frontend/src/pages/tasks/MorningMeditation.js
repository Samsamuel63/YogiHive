import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  CircularProgress,
  Fade,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion, AnimatePresence } from 'framer-motion';

const MorningMeditation = () => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [showQuote, setShowQuote] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAmbience, setSelectedAmbience] = useState('nature');
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  const quotes = [
    "Breathe in peace, breathe out tension",
    "Be present in this moment",
    "Find stillness within",
    "Let go of what you cannot control",
    "Every breath is a fresh beginning",
    "Your mind is a garden, your thoughts are the seeds",
    "Peace begins with this breath"
  ];

  const ambienceSounds = [
    { id: 'nature', name: 'Nature Sounds', icon: '🌿' },
    { id: 'rain', name: 'Gentle Rain', icon: '🌧️' },
    { id: 'waves', name: 'Ocean Waves', icon: '🌊' },
    { id: 'birds', name: 'Bird Songs', icon: '🐦' }
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    // Check if meditation was completed today
    const lastCompletionDate = localStorage.getItem('meditationLastCompleted');
    const today = new Date().toDateString();
    
    if (lastCompletionDate !== today) {
      setIsCompleted(false);
      setTimeLeft(600);
      localStorage.removeItem('meditationLastCompleted');
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
            handleMeditationComplete();
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setShowQuote(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      const quoteInterval = setInterval(() => {
        setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      }, 20000); // Change quote every 20 seconds
      return () => clearInterval(quoteInterval);
    }
  }, [isActive]);

  const handleMeditationComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    setShowQuote(true);
    
    // Save completion status
    localStorage.setItem('meditationLastCompleted', new Date().toDateString());
    
    // Update challenge progress
    const taskId = 1; // Morning Meditation is task 1
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

  const handleStart = () => {
    setIsActive(true);
    setShowQuote(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(600);
    setShowQuote(true);
    setIsCompleted(false);
    localStorage.removeItem('meditationLastCompleted');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = ((600 - timeLeft) / 600) * 100;

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
                  textAlign: 'center',
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  component={motion.h4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  🧘‍♂️ Morning Meditation
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

                <Box sx={{ position: 'relative', my: 6, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={250}
                    thickness={2}
                    sx={{
                      position: 'absolute',
                      color: 'primary.light',
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  />
                  
                  <Fade in={showQuote} timeout={500}>
                    <Typography 
                      variant="h6" 
                      color="text.secondary"
                      sx={{ 
                        position: 'absolute',
                        width: '80%',
                        textAlign: 'center',
                        fontStyle: 'italic'
                      }}
                    >
                      "{currentQuote}"
                    </Typography>
                  </Fade>

                  <Fade in={!showQuote} timeout={500}>
                    <Typography 
                      variant="h2" 
                      component="div"
                      sx={{ 
                        position: 'absolute',
                        fontFamily: 'monospace',
                        fontWeight: 'light'
                      }}
                    >
                      {formatTime(timeLeft)}
                    </Typography>
                  </Fade>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
                  <Tooltip title={isActive ? "Pause" : "Start"}>
                    <IconButton 
                      onClick={isActive ? handlePause : handleStart}
                      disabled={isCompleted}
                      sx={{ 
                        width: 64, 
                        height: 64,
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
                      {isActive ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Reset">
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

                  <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                    <IconButton
                      onClick={() => setIsMuted(!isMuted)}
                      sx={{ 
                        width: 64, 
                        height: 64,
                        backgroundColor: isMuted ? 'grey.200' : 'primary.light',
                        '&:hover': {
                          backgroundColor: isMuted ? 'grey.300' : 'primary.main',
                        }
                      }}
                    >
                      {isMuted ? <VolumeOffIcon fontSize="large" /> : <VolumeUpIcon fontSize="large" />}
                    </IconButton>
                  </Tooltip>
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
                        ✨ Great job! Meditation completed for today
                      </Typography>
                    </Paper>
                  </motion.div>
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
                  Ambience Sounds
                </Typography>
                <Grid container spacing={2}>
                  {ambienceSounds.map((sound) => (
                    <Grid item xs={6} key={sound.id}>
                      <Card
                        onClick={() => setSelectedAmbience(sound.id)}
                        sx={{
                          cursor: 'pointer',
                          bgcolor: selectedAmbience === sound.id ? 'primary.light' : 'background.paper',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 2
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" gutterBottom>
                            {sound.icon}
                          </Typography>
                          <Typography variant="body2">
                            {sound.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Benefits
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Reduces stress and anxiety
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Improves focus and clarity
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Enhances emotional well-being
                  </Typography>
                  <Typography variant="body2">
                    • Promotes better sleep quality
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );
};

export default MorningMeditation; 