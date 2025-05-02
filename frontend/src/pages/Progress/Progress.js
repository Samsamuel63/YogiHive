import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaCalendarAlt,
  FaFire,
  FaClock,
  FaTrophy,
  FaArrowUp,
  FaHome,
  FaBook,
  FaSignOutAlt,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUnlock,
  FaTasks
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

const StatCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || '#667eea'};
  color: white;
  margin-bottom: 1rem;
`;

const SectionCard = styled(Card)`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
`;

const Progress = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userKey = user?.id || 'guest';
  const [activeNav, setActiveNav] = useState('progress');
  const [progressData, setProgressData] = useState({
    streak: 0,
    completedDays: 0,
    totalTasks: 0,
    totalMinutes: 0,
    currentDay: 1,
    lastCompletedDay: null
  });

  useEffect(() => {
    const loadProgressData = () => {
      const streak = parseInt(localStorage.getItem(`challengeStreak_${userKey}`) || '0');
      const totalTasks = parseInt(localStorage.getItem(`totalTasksCompleted_${userKey}`) || '0');
      const totalMinutes = parseInt(localStorage.getItem(`totalTimeSpent_${userKey}`) || '0');
      const currentDay = parseInt(localStorage.getItem(`currentDay_${userKey}`) || '1');
      const lastCompletedDay = localStorage.getItem(`lastCompletedDay_${userKey}`);
      
      // Calculate completed days from allTimeCompletedTasks
      const allTimeCompletedTasks = JSON.parse(localStorage.getItem(`allTimeCompletedTasks_${userKey}`) || '{}');
      const completedDates = new Set();
      
      Object.keys(allTimeCompletedTasks).forEach(key => {
        const date = key.split('_')[0];
        const tasksForDate = Object.keys(allTimeCompletedTasks)
          .filter(k => k.startsWith(date))
          .length;
        if (tasksForDate >= 5) {
          completedDates.add(date);
        }
      });
      
      setProgressData({
        streak,
        completedDays: completedDates.size,
        totalTasks,
        totalMinutes,
        currentDay,
        lastCompletedDay
      });
    };

    loadProgressData();
    
    // Listen for progress updates
    const handleProgressUpdate = () => loadProgressData();
    window.addEventListener('storage', handleProgressUpdate);
    
    return () => window.removeEventListener('storage', handleProgressUpdate);
  }, [userKey]);

  // Chart data
  const chartData = {
    labels: ['Streak', 'Completed Days', 'Total Tasks', 'Total Minutes'],
    datasets: [
      {
        label: 'Progress Overview',
        data: [
          progressData.streak,
          progressData.completedDays,
          progressData.totalTasks,
          progressData.totalMinutes
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#2D3748' }}>Your Progress</Typography>
          <Typography variant="subtitle1" sx={{ color: '#718096' }}>Track your yoga journey and see how far you've come</Typography>
        </Box>

        <SectionCard>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#764ba2' }}>
            Your Progress Overview
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '400px' }}>
                <Bar data={chartData} options={chartOptions} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <StatCard>
                  <CardContent>
                    <StatIcon color="#ff6b6b">
                      <FaFire style={{ fontSize: '2rem' }} />
                    </StatIcon>
                    <Typography variant="h6" sx={{ color: '#4A5568', fontWeight: 600 }}>Current Streak</Typography>
                    <Typography variant="h4" sx={{ color: '#2D3748', fontWeight: 700 }}>{progressData.streak} days</Typography>
                  </CardContent>
                </StatCard>
                
                <StatCard>
                  <CardContent>
                    <StatIcon color="#4dabf7">
                      <FaCalendarAlt style={{ fontSize: '2rem' }} />
                    </StatIcon>
                    <Typography variant="h6" sx={{ color: '#4A5568', fontWeight: 600 }}>Completed Days</Typography>
                    <Typography variant="h4" sx={{ color: '#2D3748', fontWeight: 700 }}>{progressData.completedDays} days</Typography>
                  </CardContent>
                </StatCard>
                
                <StatCard>
                  <CardContent>
                    <StatIcon color="#ffd43b">
                      <FaTasks style={{ fontSize: '2rem' }} />
                    </StatIcon>
                    <Typography variant="h6" sx={{ color: '#4A5568', fontWeight: 600 }}>Total Tasks</Typography>
                    <Typography variant="h4" sx={{ color: '#2D3748', fontWeight: 700 }}>{progressData.totalTasks} tasks</Typography>
                  </CardContent>
                </StatCard>
                
                <StatCard>
                  <CardContent>
                    <StatIcon color="#51cf66">
                      <FaClock style={{ fontSize: '2rem' }} />
                    </StatIcon>
                    <Typography variant="h6" sx={{ color: '#4A5568', fontWeight: 600 }}>Total Time</Typography>
                    <Typography variant="h4" sx={{ color: '#2D3748', fontWeight: 700 }}>{progressData.totalMinutes} minutes</Typography>
                  </CardContent>
                </StatCard>
              </Box>
            </Grid>
          </Grid>
        </SectionCard>
      </MainContent>
    </DashboardContainer>
  );
};

export default Progress; 