import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  FaHome,
  FaRunning,
  FaTrophy,
  FaBook,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChartLine,
  FaUser,
  FaCalendarAlt,
  FaPlayCircle,
  FaEnvelope,
  FaComments
} from 'react-icons/fa';
import ChallengeProgress from '../../components/challenge/ChallengeProgress';
import DailyTasks from '../../components/challenge/DailyTasks';
import StreakCounter from '../../components/challenge/StreakCounter';
import CalendarView from '../../components/challenge/CalendarView';
import { Box, Grid, Container, Typography, Button } from '@mui/material';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  font-family: 'Poppins', sans-serif;
`;

export const Sidebar = styled(motion.div)`
  width: ${({ $isCollapsed }) => ($isCollapsed ? '72px' : '260px')};
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(18px);
  padding: 2rem 1rem 2rem 1rem;
  transition: width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s;
  position: relative;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.10), 2px 0 12px rgba(102,126,234,0.08);
  border-right: 1.5px solid rgba(102, 126, 234, 0.13);
  display: flex;
  flex-direction: column;
  align-items: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  min-height: 100vh;
  z-index: 10;
`;

const SidebarLogo = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #21CBF3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.13);
  font-size: 2rem;
  color: white;
  align-self: center;
`;

const SidebarToggle = styled(motion.button)`
  position: absolute;
  top: 1.5rem;
  right: ${({ $isCollapsed }) => ($isCollapsed ? '1.1rem' : '1.5rem')};
  background: rgba(255,255,255,0.7);
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.13);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  z-index: 20;
  &:hover {
    background: rgba(102, 126, 234, 0.13);
    transform: scale(1.12);
  }
`;

const ProfileSection = styled(motion.div)`
  display: flex;
  flex-direction: ${({ $isCollapsed }) => ($isCollapsed ? 'column' : 'row')};
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ProfilePicture = styled(motion.div)`
  width: ${({ $isCollapsed }) => ($isCollapsed ? '40px' : '60px')};
  height: ${({ $isCollapsed }) => ($isCollapsed ? '40px' : '60px')};
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ $isCollapsed }) => ($isCollapsed ? '1rem' : '1.5rem')};
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
`;

const ProfileName = styled.h3`
  color: #2d3748;
  margin: 0;
  font-size: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '1.2rem')};
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '1')};
  transition: all 0.3s ease;
  font-weight: 600;
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '1rem')};
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  padding: 1rem;
  border-radius: 14px;
  cursor: pointer;
  color: ${({ active }) => (active ? '#667eea' : '#4a5568')};
  background: ${({ active }) => (active ? 'rgba(102, 126, 234, 0.13)' : 'transparent')};
  margin-bottom: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
  min-width: 44px;
  &:hover {
    background: rgba(102, 126, 234, 0.08);
    color: #667eea;
    transform: translateX(3px) scale(1.03);
  }
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: ${({ active }) => (active ? '#667eea' : 'transparent')};
    border-radius: 0 4px 4px 0;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
`;

const NavText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '1')};
  transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s;
  font-weight: 500;
  white-space: nowrap;
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
`;

const WelcomeSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  color: #718096;
  margin: 1rem 0 0;
  font-weight: 400;
`;

const StyledPaper = styled(Box)`
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.10);
`;

const RightPanel = styled(StyledPaper)`
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.10);
  border: 1.5px solid #e2e8f0;
`;

const RefreshButton = styled(motion.button)`
  margin-top: 2rem;
  background: linear-gradient(45deg, #667eea 30%, #21CBF3 90%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 32px;
  font-weight: bold;
  text-transform: none;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.10);
  transition: background 0.3s, box-shadow 0.3s;
  &:hover {
    background: linear-gradient(45deg, #5a67d8 30%, #3182ce 90%);
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.18);
  }
`;

export const SectionCard = styled(Box)`
  background: linear-gradient(135deg, #fff 60%, #e4e8f0 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.10);
  padding: 2rem 1.5rem;
  margin-bottom: 2rem;
  transition: box-shadow 0.3s, transform 0.3s;
  &:hover {
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.18);
    transform: translateY(-2px) scale(1.01);
  }
`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  // Daily Challenge State (from ChallengePage)
  const [currentDay, setCurrentDay] = useState(1);
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [allTimeCompletedTasks, setAllTimeCompletedTasks] = useState({});

  // Add state for total tasks and total time
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0); // in minutes
  const TASK_MINUTES = 10;
  const [dayLocked, setDayLocked] = useState(false);
  const [showDayCompleteMsg, setShowDayCompleteMsg] = useState(false);

  // Add new state for tracking current day
  const [lastCompletedDay, setLastCompletedDay] = useState(null);

  // Helper to get user-specific key
  const userKey = user?.id || 'guest';

  // Fix streak calculation
  const calculateStreak = (allTimeCompletedTasks) => {
    const today = new Date().toISOString().split('T')[0];
    const completedDates = Object.keys(allTimeCompletedTasks)
      .filter(key => key.startsWith(today) || key.startsWith(getYesterday(today)))
      .map(key => key.split('_')[0]);
    
    if (completedDates.length === 0) return 0;
    
    let streak = 0;
    let currentDate = today;
    
    while (completedDates.includes(currentDate)) {
      streak++;
      currentDate = getYesterday(currentDate);
    }
    
    return streak;
  };

  // Fix reset challenge functionality
  const resetChallenge = () => {
    const today = new Date().toISOString().split('T')[0];
    const newCompletedTasks = {};
    const newAllTimeCompletedTasks = { ...allTimeCompletedTasks };
    
    // Remove today's tasks from allTimeCompletedTasks
    Object.keys(newAllTimeCompletedTasks).forEach(key => {
      if (!key.startsWith(today)) {
        newCompletedTasks[key] = newAllTimeCompletedTasks[key];
      }
    });
    
    setCompletedTasks(newCompletedTasks);
    setAllTimeCompletedTasks(newCompletedTasks);
    setDayLocked(false);
    setShowDayCompleteMsg(false);
    setIsLocked(false);
    setProgress(0);
    
    // Update localStorage
    localStorage.setItem(`completedTasks_${userKey}`, JSON.stringify(newCompletedTasks));
    localStorage.setItem(`allTimeCompletedTasks_${userKey}`, JSON.stringify(newCompletedTasks));
    localStorage.setItem(`challengeProgress_${userKey}`, '0');
    
    // Recalculate streak
    const newStreak = calculateStreak(newCompletedTasks);
    setStreak(newStreak);
    localStorage.setItem(`challengeStreak_${userKey}`, newStreak.toString());
    
    setSuccessMessage('Challenge has been reset for today!');
    setShowSuccessMessage(true);
  };

  // Fix day progression logic
  useEffect(() => {
    const checkDayProgression = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastDay = localStorage.getItem(`lastCompletedDay_${userKey}`);
      
      if (lastDay && lastDay !== today) {
        // If it's a new day, increment the current day
        const newDay = parseInt(localStorage.getItem(`currentDay_${userKey}`) || '1') + 1;
        setCurrentDay(newDay);
        localStorage.setItem(`currentDay_${userKey}`, newDay.toString());
        localStorage.setItem(`lastCompletedDay_${userKey}`, today);
        
        // Don't reset progress, just update the current day
        setDayLocked(false);
        setShowDayCompleteMsg(false);
      }
    };

    // Check every minute
    const interval = setInterval(checkDayProgression, 60000);
    return () => clearInterval(interval);
  }, [userKey]);

  // Fix calendar marking
  const getCompletedDates = () => {
    const completedDates = {};
    Object.keys(allTimeCompletedTasks).forEach(key => {
      const date = key.split('_')[0];
      const tasksForDate = Object.keys(allTimeCompletedTasks)
        .filter(k => k.startsWith(date))
        .length;
      if (tasksForDate >= 5) {
        completedDates[date] = true;
      }
    });
    return completedDates;
  };

  // Update task completion handler
  const handleTaskComplete = (taskId) => {
    if (isLocked || dayLocked) return;
    
    const today = new Date().toISOString().split('T')[0];
    const taskKey = `${today}_task${taskId}`;
    
    // Check if the task is already completed for today
    if (completedTasks[taskKey]) {
      setSuccessMessage("This task is already completed for today!");
      setShowSuccessMessage(true);
      return;
    }
    
    const newCompletedTasks = {
      ...completedTasks,
      [taskKey]: true
    };
    
    const newAllTimeCompletedTasks = {
      ...allTimeCompletedTasks,
      [taskKey]: true
    };
    
    setCompletedTasks(newCompletedTasks);
    setAllTimeCompletedTasks(newAllTimeCompletedTasks);
    
    // Update localStorage
    localStorage.setItem(`completedTasks_${userKey}`, JSON.stringify(newCompletedTasks));
    localStorage.setItem(`allTimeCompletedTasks_${userKey}`, JSON.stringify(newAllTimeCompletedTasks));
    
    // Update progress
    const newProgress = progress + 1;
    setProgress(newProgress);
    localStorage.setItem(`challengeProgress_${userKey}`, newProgress.toString());
    
    // Update total tasks and time
    const newTotalTasks = totalTasksCompleted + 1;
    const newTotalTime = totalTimeSpent + TASK_MINUTES;
    setTotalTasksCompleted(newTotalTasks);
    setTotalTimeSpent(newTotalTime);
    localStorage.setItem(`totalTasksCompleted_${userKey}`, newTotalTasks.toString());
    localStorage.setItem(`totalTimeSpent_${userKey}`, newTotalTime.toString());
    
    // Check if all tasks for today are completed
    const completedToday = Object.keys(newCompletedTasks)
      .filter(key => key.startsWith(today))
      .length;
    
    if (completedToday === 5) {
      setDayLocked(true);
      setShowDayCompleteMsg(true);
      setSuccessMessage("Congratulations on completing the day! Come back tomorrow for more.");
      setShowSuccessMessage(true);
      
      // Mark today as completed
      localStorage.setItem(`lastCompletedDay_${userKey}`, today);
      
      // Recalculate streak
      const newStreak = calculateStreak(newAllTimeCompletedTasks);
      setStreak(newStreak);
      localStorage.setItem(`challengeStreak_${userKey}`, newStreak.toString());
    }
  };

  // Fix useEffect for streak calculation
  useEffect(() => {
    const interval = setInterval(() => {
      const newStreak = calculateStreak(allTimeCompletedTasks);
      if (newStreak !== streak) {
        setStreak(newStreak);
        localStorage.setItem(`challengeStreak_${userKey}`, newStreak.toString());
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [allTimeCompletedTasks, streak, userKey]);

  useEffect(() => {
    // Fetch user's challenge progress from localStorage
    const fetchProgress = () => {
      try {
        const savedProgress = localStorage.getItem(`challengeProgress_${userKey}`);
        const savedStreak = localStorage.getItem(`challengeStreak_${userKey}`);
        const savedDay = localStorage.getItem(`currentDay_${userKey}`);
        const savedCompletedTasks = localStorage.getItem(`completedTasks_${userKey}`);
        const savedAllTimeCompletedTasks = localStorage.getItem(`allTimeCompletedTasks_${userKey}`);
        const savedLastCompletedDate = localStorage.getItem(`lastCompletedDate_${userKey}`);
        if (savedProgress) setProgress(parseInt(savedProgress) || 0);
        if (savedStreak) setStreak(parseInt(savedStreak) || 0);
        if (savedDay) setCurrentDay(parseInt(savedDay) || 1);
        if (savedCompletedTasks) setCompletedTasks(JSON.parse(savedCompletedTasks) || {});
        if (savedAllTimeCompletedTasks) setAllTimeCompletedTasks(JSON.parse(savedAllTimeCompletedTasks) || {});
        if (savedLastCompletedDate) setLastCompletedDate(new Date(savedLastCompletedDate));
      } catch (error) {
        console.error('Error fetching challenge progress:', error);
        resetChallenge();
      }
    };
    fetchProgress();
    const handleProgressUpdate = () => { fetchProgress(); };
    window.addEventListener('challengeProgressUpdated', handleProgressUpdate);
    return () => { window.removeEventListener('challengeProgressUpdated', handleProgressUpdate); };
  }, [userKey]);

  useEffect(() => {
    // Update locked state based on current day and progress
    const totalTasksPerDay = 5;
    const requiredProgress = (currentDay - 1) * totalTasksPerDay;
    setIsLocked(progress < requiredProgress);
  }, [currentDay, progress]);

  // On mount, load stats
  useEffect(() => {
    const savedTotalTasks = localStorage.getItem(`totalTasksCompleted_${userKey}`);
    const savedTotalTime = localStorage.getItem(`totalTimeSpent_${userKey}`);
    setTotalTasksCompleted(savedTotalTasks ? parseInt(savedTotalTasks) : 0);
    setTotalTimeSpent(savedTotalTime ? parseInt(savedTotalTime) : 0);
  }, [userKey]);

  // Helper to get today's date string
  const todayDate = new Date().toISOString().split('T')[0];

  // Helper to get yesterday's date string
  function getYesterday(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  const handleLogout = () => {
    logout();
    addToast('Successfully logged out!', 'success');
    navigate('/');
  };

  return (
    <DashboardContainer>
      <Sidebar $isCollapsed={isCollapsed}>
        <SidebarLogo>
          <FaUser />
        </SidebarLogo>
        <SidebarToggle 
          $isCollapsed={isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </SidebarToggle>
        
        <ProfileSection 
          $isCollapsed={isCollapsed}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfilePicture 
            $isCollapsed={isCollapsed}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </ProfilePicture>
          <ProfileName $isCollapsed={isCollapsed}>{user?.name}</ProfileName>
        </ProfileSection>

        <NavItem
          active={activeNav === 'dashboard'}
          onClick={() => setActiveNav('dashboard')}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaHome />
          <NavText $isCollapsed={isCollapsed}>Dashboard</NavText>
        </NavItem>

        <NavItem
          active={activeNav === 'progress'}
          onClick={() => {
            setActiveNav('progress');
            navigate('/progress');
          }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaChartLine />
          <NavText $isCollapsed={isCollapsed}>Progress</NavText>
        </NavItem>

        <NavItem
          active={activeNav === 'achievements'}
          onClick={() => {
            setActiveNav('achievements');
            navigate('/achievements');
          }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaTrophy />
          <NavText $isCollapsed={isCollapsed}>Achievements</NavText>
        </NavItem>

        <NavItem
          active={activeNav === 'profile'}
          onClick={() => {
            setActiveNav('profile');
            navigate('/profile');
          }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaUser />
          <NavText $isCollapsed={isCollapsed}>Profile</NavText>
        </NavItem>

        <NavItem
          active={activeNav === 'tutorials'}
          onClick={() => {
            setActiveNav('tutorials');
            navigate('/tutorials');
          }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaBook />
          <NavText $isCollapsed={isCollapsed}>Tutorials</NavText>
        </NavItem>

        <NavItem
          active={activeNav === 'about'}
          onClick={() => {
            setActiveNav('about');
            navigate('/about');
          }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaBook />
          <NavText $isCollapsed={isCollapsed}>About</NavText>
        </NavItem>

        <NavItem
          active={activeNav === 'contact'}
          onClick={() => {
            setActiveNav('contact');
            navigate('/contact');
          }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaEnvelope />
          <NavText $isCollapsed={isCollapsed}>Contact</NavText>
        </NavItem>

        <NavItem
          active={activeNav === 'chatroom'}
          onClick={() => {
            setActiveNav('chatroom');
            navigate('/Chatrooms');
          }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaComments />
          <NavText $isCollapsed={isCollapsed}>Chatroom</NavText>
        </NavItem>

        <NavItem
          onClick={handleLogout}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaSignOutAlt />
          <NavText $isCollapsed={isCollapsed}>Logout</NavText>
        </NavItem>
      </Sidebar>

      <MainContent style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)' }}>
        {/* Welcome Section */}
        <SectionCard sx={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <FaUser style={{ fontSize: 28, marginRight: 10 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1 }}>Welcome back, {user?.name || 'Yogi'}! 🧘‍♂️</Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 400, opacity: 0.9 }}>Continue your wellness journey with today's activities.</Typography>
        </SectionCard>

        {/* Quick Start Section */}
        <SectionCard sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 60%, #e0e7ff 100%)', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FaPlayCircle style={{ fontSize: 22, color: '#667eea', marginRight: 8 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>Quick Start</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" size="large" onClick={() => navigate('/yogi-ji')} sx={{ borderRadius: 3, fontWeight: 600, boxShadow: 2, px: 4 }}>Yogi Ji</Button>
            <Button variant="outlined" color="info" size="large" onClick={() => navigate('/scheduler')} sx={{ borderRadius: 3, fontWeight: 600, boxShadow: 2, px: 4 }}>Task Manager</Button>
            <Button variant="outlined" color="success" size="large" onClick={() => navigate('/nutrition-onboarding')} sx={{ borderRadius: 3, fontWeight: 600, boxShadow: 2, px: 4 }}>Nutrition Planner</Button>
          </Box>
        </SectionCard>

        {/* Yoga Levels Section */}
        <SectionCard sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FaPlayCircle style={{ fontSize: 22, color: '#764ba2', marginRight: 8 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#764ba2' }}>Yoga Levels</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" color="success" size="large" onClick={() => navigate('/Easy')} sx={{ borderRadius: 3, fontWeight: 600, minWidth: 120 }}>Easy</Button>
            <Button variant="outlined" color="warning" size="large" onClick={() => navigate('/Medium')} sx={{ borderRadius: 3, fontWeight: 600, minWidth: 120 }}>Medium</Button>
            <Button variant="outlined" color="error" size="large" onClick={() => navigate('/Hard')} sx={{ borderRadius: 3, fontWeight: 600, minWidth: 120 }}>Hard</Button>
          </Box>
        </SectionCard>

        {/* Main Dashboard Content in Squares */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SectionCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaPlayCircle style={{ fontSize: 22, color: '#764ba2', marginRight: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#764ba2' }}>Daily Challenge</Typography>
              </Box>
              <ChallengeProgress progress={progress % 5} />
              <DailyTasks 
                day={currentDay}
                onTaskComplete={handleTaskComplete}
                isLocked={isLocked}
                completedTasks={completedTasks}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <RefreshButton 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetChallenge}
                >
                  Reset Challenge
                </RefreshButton>
              </Box>
            </SectionCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <SectionCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaCalendarAlt style={{ fontSize: 22, color: '#667eea', marginRight: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>Progress & Calendar</Typography>
              </Box>
              <StreakCounter streak={streak} />
              <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total Tasks Completed: {totalTasksCompleted}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total Time Spent: {totalTimeSpent} min</Typography>
              </Box>
              <CalendarView 
                currentDay={currentDay} 
                completedDays={Math.floor(progress / 5)}
                completedDates={getCompletedDates()}
              />
              {showDayCompleteMsg && (
                <Box sx={{ mt: 2, p: 2, background: '#e6ffe6', borderRadius: '12px', color: '#2d7a2d', fontWeight: 600 }}>
                  {successMessage}
                </Box>
              )}
            </SectionCard>
          </Grid>
        </Grid>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard; 