import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ChallengeProgress from '../../components/challenge/ChallengeProgress';
import DailyTasks from '../../components/challenge/DailyTasks';
import StreakCounter from '../../components/challenge/StreakCounter';
import CalendarView from '../../components/challenge/CalendarView';
import { useNavigate } from 'react-router-dom';
import './ChallengePage.css';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CreateIcon from '@mui/icons-material/Create';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { useAuth } from '../../context/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '16px',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const RefreshButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
  },
}));

const ChallengePage = () => {
  const { user } = useAuth();
  const userKey = user?.id || 'guest';
  const [currentDay, setCurrentDay] = useState(1);
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const resetChallenge = () => {
    // Reset all states
    setCurrentDay(1);
    setProgress(0);
    setStreak(0);
    setIsLocked(false);
    setCompletedTasks({});
    setLastCompletedDate(null);

    // Clear all challenge-related data from localStorage
    localStorage.removeItem(`challengeProgress_${userKey}`);
    localStorage.removeItem(`challengeStreak_${userKey}`);
    localStorage.removeItem(`currentDay_${userKey}`);
    localStorage.removeItem(`completedTasks_${userKey}`);
    localStorage.removeItem(`lastCompletedDate_${userKey}`);

    // Show reset message
    setSuccessMessage('Challenge has been reset! Start fresh with Day 1.');
    setShowSuccessMessage(true);
  };

  useEffect(() => {
    // Fetch user's challenge progress from localStorage
    const fetchProgress = () => {
      try {
        const savedProgress = localStorage.getItem(`challengeProgress_${userKey}`);
        const savedStreak = localStorage.getItem(`challengeStreak_${userKey}`);
        const savedDay = localStorage.getItem(`currentDay_${userKey}`);
        const savedCompletedTasks = localStorage.getItem(`completedTasks_${userKey}`);
        const savedLastCompletedDate = localStorage.getItem(`lastCompletedDate_${userKey}`);
        
        if (savedProgress) setProgress(parseInt(savedProgress) || 0);
        if (savedStreak) setStreak(parseInt(savedStreak) || 0);
        if (savedDay) setCurrentDay(parseInt(savedDay) || 1);
        if (savedCompletedTasks) setCompletedTasks(JSON.parse(savedCompletedTasks) || {});
        if (savedLastCompletedDate) setLastCompletedDate(new Date(savedLastCompletedDate));
      } catch (error) {
        console.error('Error fetching challenge progress:', error);
        resetChallenge();
      }
    };

    fetchProgress();

    // Listen for progress updates from task components
    const handleProgressUpdate = () => {
      fetchProgress();
    };

    window.addEventListener('challengeProgressUpdated', handleProgressUpdate);

    return () => {
      window.removeEventListener('challengeProgressUpdated', handleProgressUpdate);
    };
  }, [userKey]);

  useEffect(() => {
    // Check if a new day has started
    const checkNewDay = () => {
      if (lastCompletedDate) {
        const today = new Date();
        const lastDate = new Date(lastCompletedDate);
        
        // Check if it's a new day
        if (today.getDate() !== lastDate.getDate() || 
            today.getMonth() !== lastDate.getMonth() || 
            today.getFullYear() !== lastDate.getFullYear()) {
          resetChallenge();
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkNewDay, 60000);
    return () => clearInterval(interval);
  }, [lastCompletedDate]);

  useEffect(() => {
    // Update locked state based on current day and progress
    const totalTasksPerDay = 5;
    const requiredProgress = (currentDay - 1) * totalTasksPerDay;
    setIsLocked(progress < requiredProgress);
  }, [currentDay, progress]);

  const handleTaskComplete = (taskId) => {
    if (isLocked) return;

    const taskKey = `day${currentDay}_task${taskId}`;
    const wasCompleted = completedTasks[taskKey];

    // Update completed tasks
    const newCompletedTasks = {
      ...completedTasks,
      [taskKey]: !wasCompleted // Toggle completion status
    };
    setCompletedTasks(newCompletedTasks);
    localStorage.setItem(`completedTasks_${userKey}`, JSON.stringify(newCompletedTasks));

    // Update progress based on completion status
    const newProgress = progress + (!wasCompleted ? 1 : -1);
    setProgress(newProgress);
    localStorage.setItem(`challengeProgress_${userKey}`, newProgress.toString());

    // Update last completed date
    const now = new Date();
    setLastCompletedDate(now);
    localStorage.setItem(`lastCompletedDate_${userKey}`, now.toISOString());

    // Check if all tasks for the day are completed
    const totalTasksPerDay = 5;
    const completedTasksToday = Object.keys(newCompletedTasks)
      .filter(key => key.startsWith(`day${currentDay}_`))
      .length;

    if (completedTasksToday === totalTasksPerDay) {
      // Update streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem(`challengeStreak_${userKey}`, newStreak.toString());

      // Show day completion message
      setSuccessMessage(`Congratulations! You've completed Day ${currentDay}!`);
      setShowSuccessMessage(true);

      // Move to next day if not the last day
      if (currentDay < 30) {
        const nextDay = currentDay + 1;
        setCurrentDay(nextDay);
        localStorage.setItem(`currentDay_${userKey}`, nextDay.toString());
        
        // Reset checkpoints for the new day
        const updatedTasks = {};
        setCompletedTasks(updatedTasks);
        localStorage.setItem(`completedTasks_${userKey}`, JSON.stringify(updatedTasks));

        // Show new day message
        setSuccessMessage(`Starting Day ${nextDay}! Fresh checklist ready!`);
        setShowSuccessMessage(true);
      }
    }
  };

  // Calculate today's progress (0-5 tasks)
  const todayProgress = progress % 5;
  // Calculate completed days
  const completedDays = Math.floor(progress / 5);

  const tasks = [
    {
      id: 1,
      title: "Morning Meditation",
      description: "Start your day with 10 minutes of mindful meditation",
      path: "/tasks/morning-meditation",
      icon: <SelfImprovementIcon />
    },
    {
      id: 2,
      title: "Yoga Flow",
      description: "15-minute energizing yoga sequence",
      path: "/tasks/yoga-flow",
      icon: <FitnessCenterIcon />
    },
    {
      id: 3,
      title: "Water Intake",
      description: "Track your daily water intake goal",
      path: "/tasks/water-intake",
      icon: <WaterDropIcon />
    },
    {
      id: 4,
      title: "Gratitude Journal",
      description: "Write three things you are grateful for today",
      path: "/tasks/gratitude-journal",
      icon: <CreateIcon />
    },
    {
      id: 5,
      title: "Evening Stretching",
      description: "Wind down with gentle stretching exercises",
      path: "/tasks/evening-stretching",
      icon: <AccessibilityNewIcon />
    }
  ];

  return (
    <div className="challenge-page">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h3" component="h1" gutterBottom align="center" className="challenge-title">
              30-Day Mind & Body Challenge
            </Typography>
            <Typography variant="subtitle1" align="center" sx={{ mb: 4 }} className="challenge-subtitle">
              Transform your life one day at a time
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <StyledPaper>
                <ChallengeProgress progress={todayProgress} totalTasks={5} />
                <DailyTasks 
                  day={currentDay}
                  onTaskComplete={handleTaskComplete}
                  isLocked={isLocked}
                  completedTasks={completedTasks}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <RefreshButton 
                    variant="contained" 
                    onClick={resetChallenge}
                    sx={{ 
                      borderRadius: '25px',
                      padding: '10px 24px',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    Reset Challenge
                  </RefreshButton>
                </Box>
              </StyledPaper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StyledPaper>
                <StreakCounter streak={streak} />
                <CalendarView currentDay={currentDay} completedDays={completedDays} />
              </StyledPaper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ChallengePage; 