import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome, FaRunning, FaTrophy, FaBook, FaSignOutAlt, FaChartLine, FaUser, FaEnvelope, FaPlayCircle, FaCamera, FaBrain, FaGlobe, FaAppleAlt, FaHeart
} from 'react-icons/fa';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemIcon, ListItemText, Button, Avatar } from '@mui/material';
import Shruti from "../images/Shruti.jpeg";
import Samuel from "../images/Samuel.jpeg";
import Prachi from "../images/Prachi.jpeg";
import Manya from "../images/Manya.jpeg";

// Styled components (copied from Dashboard.js)
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
const SectionCard = styled(Box)`
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

const FeatureCard = styled(Card)`
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

const SocialButton = styled(Button)`
  border-radius: 12px;
  padding: 10px 24px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const About = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('about');

  const features = [
    {
      title: 'Real-time Pose Detection',
      description: 'Get instant feedback on your yoga poses with advanced AI technology',
      icon: <FaCamera />
    },
    {
      title: 'AI-powered Analysis',
      description: 'Receive detailed accuracy analysis of your poses',
      icon: <FaBrain />
    },
    {
      title: 'Interactive Visualization',
      description: 'See your virtual skeleton move in real-time',
      icon: <FaChartLine />
    },
    {
      title: 'Web-based Platform',
      description: 'No installation required - access from any device',
      icon: <FaGlobe />
    },
    {
      title: 'Personalized Nutrition',
      description: 'Get customized nutrition plan suggestions',
      icon: <FaAppleAlt />
    },
    {
      title: 'Health-Focused Poses',
      description: 'Access poses specifically designed for health concerns',
      icon: <FaHeart />
    }
  ];

  const team = [
    {
      name: "Samuel Kerketta",
      enrollment: "08514902022",
      shift: "Morning Shift",
      batch: "2022-25",
      image: Samuel
    },
    {
      name: "Shruti Aggarwal",
      enrollment: "07214902022",
      shift: "Morning Shift",
      batch: "2022-25",
      image: Shruti
    },
    {
      name: "Prachi Dahiya",
      enrollment: "35514902022",
      shift: "Morning Shift",
      batch: "2022-25",
      image: Prachi
    },
    {
      name: "Manya Surayn",
      enrollment: "07614902022",
      shift: "Morning Shift",
      batch: "2022-25",
      image: Manya
    }
  ];

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
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#2D3748' }}>About YogiHive</Typography>
          <Typography variant="subtitle1" sx={{ color: '#718096' }}>Your Personal AI-Powered Yoga Guide</Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard>
                <CardContent>
                  <Box sx={{ mb: 2, color: '#667eea' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#2D3748' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#718096' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(102, 126, 234, 0.08)', mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#2D3748' }}>How It Works</Typography>
            <Typography variant="body1" sx={{ color: '#4A5568', mb: 3 }}>
              YogiHive uses deep learning techniques to analyze key body points and classify yoga poses with precision. If a pose is performed correctly with over 95% accuracy, it highlights the user's virtual skeleton in green, ensuring an engaging and intuitive experience. The model was trained in Python using TensorFlow and later converted to TensorFlow.js, allowing smooth execution in web browsers without requiring extra installations.
            </Typography>
            <Typography variant="body1" sx={{ color: '#4A5568' }}>
              Our system uses a combination of pose estimation and classification models to provide real-time feedback. The pose estimation model tracks 17 key points on the body, while the classification model compares these points to ideal pose positions. This dual-model approach ensures accurate and reliable feedback for users of all skill levels.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2D3748' }}>Meet the Team</Typography>
          <Grid container spacing={3}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)'
                  }
                }}>
                  <CardContent sx={{ width: '100%' }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid #667eea',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#2D3748' }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#667eea', mb: 1 }}>
                      {member.enrollment}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096', mb: 0.5 }}>
                      {member.shift}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      {member.batch}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2D3748' }}>Connect With Us</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <SocialButton
              variant="outlined"
              color="info"
              href="https://www.facebook.com/profile.php?id=100008776262672"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </SocialButton>
            <SocialButton
              variant="outlined"
              color="secondary"
              href="https://www.instagram.com/sam_samuel63/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </SocialButton>
            <SocialButton
              variant="outlined"
              color="primary"
              href="https://www.linkedin.com/in/samuel-kerketta/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </SocialButton>
          </Box>
        </Box>
      </MainContent>
    </DashboardContainer>
  );
};

export default About;