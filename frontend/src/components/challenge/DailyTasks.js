import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CreateIcon from '@mui/icons-material/Create';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

const DailyTasks = ({ day, onTaskComplete, isLocked, completedTasks }) => {
  const navigate = useNavigate();

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

  const handleTaskClick = (task) => {
    if (!isLocked) {
      navigate(task.path);
    }
  };

  const handleButtonClick = (e, task, isCompleted) => {
    e.stopPropagation(); // Prevent card click
    if (!isLocked) {
      if (!isCompleted) {
        // If not completed, navigate to task
        navigate(task.path);
      } else {
        // If already completed, mark as incomplete (toggle functionality)
        onTaskComplete(task.id);
      }
    }
  };

  const handleComplete = (e, taskId) => {
    e.stopPropagation(); // Prevent any navigation
    if (!isLocked) {
      onTaskComplete(taskId);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Day {day} Tasks
      </Typography>
      <Grid container spacing={2}>
        {tasks.map((task) => {
          const isCompleted = completedTasks[`day${day}_task${task.id}`];
          return (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card 
                className={`task-card ${isCompleted ? 'task-completed' : ''} ${isLocked ? 'task-locked' : ''}`}
                onClick={() => handleTaskClick(task)}
                sx={{ 
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  backgroundColor: isLocked ? 'rgba(0,0,0,0.05)' : 'white',
                  '&:hover': {
                    transform: isLocked ? 'none' : 'translateY(-5px)',
                    boxShadow: isLocked ? 1 : 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ mr: 1, color: isLocked ? 'text.disabled' : 'primary.main' }}>
                      {task.icon}
                    </Box>
                    <Typography 
                      variant="h6"
                      sx={{ color: isLocked ? 'text.disabled' : 'text.primary' }}
                    >
                      {task.title}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ color: isLocked ? 'text.disabled' : 'text.secondary' }}
                  >
                    {task.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                  <Button 
                    fullWidth
                    variant="contained" 
                    color={isCompleted ? "success" : "primary"}
                    disabled={isLocked}
                    onClick={(e) => handleButtonClick(e, task, isCompleted)}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      opacity: isLocked ? 0.5 : 1,
                      mr: 1
                    }}
                  >
                    {isCompleted ? "Completed" : "Start Task"}
                  </Button>
                  {!isCompleted && (
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={isLocked}
                      onClick={(e) => handleComplete(e, task.id)}
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        minWidth: 'auto'
                      }}
                    >
                      Mark Complete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DailyTasks; 