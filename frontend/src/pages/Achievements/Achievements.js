import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaTrophy,
  FaFire,
  FaStar,
  FaHeart,
  FaBalanceScale,
  FaClock,
  FaCalendarAlt,
  FaDumbbell,
  FaGlobe,
  FaBook,
  FaShareAlt,
  FaAward,
  FaHome,
  FaChartLine,
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaMedal,
  FaLock,
  FaCheck,
  FaLeaf,
  FaUsers,
  FaMusic,
  FaCamera,
  FaBrain,
  FaSun,
  FaMoon,
  FaAppleAlt,
  FaRunning,
  FaPrayingHands,
  FaSpa,
  FaHandPeace
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Card, CardContent, Grid, Container, Button } from '@mui/material';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  font-family: 'Poppins', sans-serif;
`;

const Sidebar = styled(motion.div)`
  width: 260px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(18px);
  padding: 2rem 1rem;
  position: relative;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.10);
  border-right: 1px solid rgba(102, 126, 234, 0.13);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  z-index: 10;
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-start;
  padding: 1rem;
  border-radius: 14px;
  cursor: pointer;
  color: #4a5568;
  background: transparent;
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
`;

const NavText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
`;

const AchievementCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }
`;

const AchievementIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || '#667eea'};
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 3px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  width: ${({ progress }) => progress}%;
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const AchievementTitle = styled.h6`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 0.5rem;
`;

const AchievementDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1rem;
`;

const ProgressText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  color: #718096;
`;

const UnlockedBadge = styled.span`
  background: #48BB78;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2D3748;
  margin-bottom: 1rem;
`;

const WelcomeSubtitle = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1.125rem;
  color: #718096;
`;

const Achievements = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('achievements');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [achievements, setAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState({
    totalTasks: 0,
    streak: 0,
    totalMinutes: 0,
    completedDays: 0,
    meditationSessions: 0,
    sharedAchievements: 0,
    perfectPoses: 0,
    consecutiveDays: 0,
    totalSessions: 0,
    totalChallenges: 0
  });

  useEffect(() => {
    // Load user progress from localStorage
    const loadUserProgress = () => {
      const userKey = user?.id || 'guest';
      const savedStreak = localStorage.getItem(`challengeStreak_${userKey}`);
      const savedTotalTasks = localStorage.getItem(`totalTasksCompleted_${userKey}`);
      const savedTotalTime = localStorage.getItem(`totalTimeSpent_${userKey}`);
      const savedCompletedDays = localStorage.getItem(`completedDays_${userKey}`);
      const savedMeditationSessions = localStorage.getItem(`meditationSessions_${userKey}`);
      const savedSharedAchievements = localStorage.getItem(`sharedAchievements_${userKey}`);
      const savedPerfectPoses = localStorage.getItem(`perfectPoses_${userKey}`);
      const savedConsecutiveDays = localStorage.getItem(`consecutiveDays_${userKey}`);
      const savedTotalSessions = localStorage.getItem(`totalSessions_${userKey}`);
      const savedTotalChallenges = localStorage.getItem(`totalChallenges_${userKey}`);

      setUserProgress({
        totalTasks: parseInt(savedTotalTasks) || 0,
        streak: parseInt(savedStreak) || 0,
        totalMinutes: parseInt(savedTotalTime) || 0,
        completedDays: parseInt(savedCompletedDays) || 0,
        meditationSessions: parseInt(savedMeditationSessions) || 0,
        sharedAchievements: parseInt(savedSharedAchievements) || 0,
        perfectPoses: parseInt(savedPerfectPoses) || 0,
        consecutiveDays: parseInt(savedConsecutiveDays) || 0,
        totalSessions: parseInt(savedTotalSessions) || 0,
        totalChallenges: parseInt(savedTotalChallenges) || 0
      });
    };

    loadUserProgress();
  }, [user]);

  useEffect(() => {
    // Update achievements based on user progress
    const updatedAchievements = [
      // Practice-based Achievements
      {
        icon: <FaBrain />,
        title: 'Yoga Master',
        description: 'Complete 100 yoga sessions',
        progress: Math.min(userProgress.totalSessions, 100),
        total: 100,
        unlocked: userProgress.totalSessions >= 100,
        color: '#FF6B6B',
        category: 'Practice'
      },
      {
        icon: <FaFire />,
        title: 'Streak Master',
        description: 'Maintain a 30-day streak',
        progress: Math.min(userProgress.streak, 30),
        total: 30,
        unlocked: userProgress.streak >= 30,
        color: '#FF9F43',
        category: 'Practice'
      },
      {
        icon: <FaCalendarAlt />,
        title: 'Consistency Champion',
        description: 'Complete 50 days of practice',
        progress: Math.min(userProgress.completedDays, 50),
        total: 50,
        unlocked: userProgress.completedDays >= 50,
        color: '#4ECDC4',
        category: 'Practice'
      },
      {
        icon: <FaDumbbell />,
        title: 'Challenge Conqueror',
        description: 'Complete 20 challenges',
        progress: Math.min(userProgress.totalChallenges, 20),
        total: 20,
        unlocked: userProgress.totalChallenges >= 20,
        color: '#45B7D1',
        category: 'Practice'
      },

      // Skill-based Achievements
      {
        icon: <FaBalanceScale />,
        title: 'Balance Expert',
        description: 'Hold a balance pose for 1 minute',
        progress: Math.min(userProgress.perfectPoses, 1),
        total: 1,
        unlocked: userProgress.perfectPoses >= 1,
        color: '#96CEB4',
        category: 'Skill'
      },
      {
        icon: <FaClock />,
        title: 'Pose Perfectionist',
        description: 'Achieve 50 perfect poses',
        progress: Math.min(userProgress.perfectPoses, 50),
        total: 50,
        unlocked: userProgress.perfectPoses >= 50,
        color: '#FFEEAD',
        category: 'Skill'
      },

      // Wellness Achievements
      {
        icon: <FaSpa />,
        title: 'Mindful Warrior',
        description: 'Complete 30 days of meditation',
        progress: Math.min(userProgress.meditationSessions, 30),
        total: 30,
        unlocked: userProgress.meditationSessions >= 30,
        color: '#D4A5A5',
        category: 'Wellness'
      },
      {
        icon: <FaHeart />,
        title: 'Wellness Warrior',
        description: 'Practice for 1000 minutes',
        progress: Math.min(userProgress.totalMinutes, 1000),
        total: 1000,
        unlocked: userProgress.totalMinutes >= 1000,
        color: '#FF6B6B',
        category: 'Wellness'
      },

      // Experience Achievements
      {
        icon: <FaStar />,
        title: 'Yoga Explorer',
        description: 'Try 10 different poses',
        progress: Math.min(userProgress.totalTasks, 10),
        total: 10,
        unlocked: userProgress.totalTasks >= 10,
        color: '#FFD93D',
        category: 'Experience'
      },
      {
        icon: <FaGlobe />,
        title: 'Global Yogi',
        description: 'Complete all difficulty levels',
        progress: Math.min(userProgress.totalChallenges, 3),
        total: 3,
        unlocked: userProgress.totalChallenges >= 3,
        color: '#4ECDC4',
        category: 'Experience'
      },

      // Social & Learning Achievements
      {
        icon: <FaShareAlt />,
        title: 'Community Leader',
        description: 'Share 50 achievements',
        progress: Math.min(userProgress.sharedAchievements, 50),
        total: 50,
        unlocked: userProgress.sharedAchievements >= 50,
        color: '#45B7D1',
        category: 'Social'
      },
      {
        icon: <FaBook />,
        title: 'Knowledge Seeker',
        description: 'Complete all tutorials',
        progress: Math.min(userProgress.totalTasks, 5),
        total: 5,
        unlocked: userProgress.totalTasks >= 5,
        color: '#96CEB4',
        category: 'Learning'
      }
    ];

    setAchievements(updatedAchievements);
  }, [userProgress]);

  const categories = ['all', 'Practice', 'Skill', 'Wellness', 'Experience', 'Social', 'Learning'];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(achievement => achievement.category === selectedCategory);

  return (
    <DashboardContainer>
      <Sidebar>
        <NavItem onClick={() => { setActiveNav('dashboard'); navigate('/dashboard'); }} active={activeNav === 'dashboard'}><FaHome /><NavText>Dashboard</NavText></NavItem>
        <NavItem onClick={() => { setActiveNav('progress'); navigate('/progress'); }} active={activeNav === 'progress'}><FaChartLine /><NavText>Progress</NavText></NavItem>
        <NavItem onClick={() => { setActiveNav('achievements'); navigate('/achievements'); }} active={activeNav === 'achievements'}><FaTrophy /><NavText>Achievements</NavText></NavItem>
        <NavItem onClick={() => { setActiveNav('profile'); navigate('/profile'); }} active={activeNav === 'profile'}><FaUser /><NavText>Profile</NavText></NavItem>
        <NavItem onClick={() => { setActiveNav('tutorials'); navigate('/tutorials'); }} active={activeNav === 'tutorials'}><FaBook /><NavText>Tutorials</NavText></NavItem>
        <NavItem onClick={() => { setActiveNav('about'); navigate('/about'); }} active={activeNav === 'about'}><FaBook /><NavText>About</NavText></NavItem>
        <NavItem onClick={() => { setActiveNav('contact'); navigate('/contact'); }} active={activeNav === 'contact'}><FaEnvelope /><NavText>Contact</NavText></NavItem>
        <NavItem onClick={() => { logout(); navigate('/'); }}><FaSignOutAlt /><NavText>Logout</NavText></NavItem>
      </Sidebar>
      <MainContent>
        <Container maxWidth="lg">
          <WelcomeSection>
            <WelcomeTitle>Achievements</WelcomeTitle>
            <WelcomeSubtitle>Track your progress and unlock new milestones</WelcomeSubtitle>
          </WelcomeSection>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'contained' : 'outlined'}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  px: 3,
                  py: 1
                }}
              >
                {category}
              </Button>
            ))}
          </Box>

          <Grid container spacing={3}>
            {filteredAchievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AchievementCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  $unlocked={achievement.unlocked}
                >
                  <CardContent>
                    <AchievementIcon $unlocked={achievement.unlocked}>
                      {achievement.icon}
                    </AchievementIcon>
                    <AchievementTitle>{achievement.title}</AchievementTitle>
                    <AchievementDescription>{achievement.description}</AchievementDescription>
                    <ProgressBar>
                      <ProgressFill
                        $progress={(achievement.progress / achievement.total) * 100}
                        $unlocked={achievement.unlocked}
                      />
                    </ProgressBar>
                    <ProgressText>
                      {achievement.progress} / {achievement.total}
                    </ProgressText>
                    {achievement.unlocked && (
                      <UnlockedBadge>
                        <FaAward /> Unlocked
                      </UnlockedBadge>
                    )}
                  </CardContent>
                </AchievementCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </MainContent>
    </DashboardContainer>
  );
};

export default Achievements; 