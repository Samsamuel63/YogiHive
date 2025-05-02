import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle, FaHome, FaChartLine, FaTrophy, FaUser, FaBook, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import YogiJiChatbot from '../../components/YogiJiChatbot';
import YogiJiButton from '../../components/YogiJiButton';
import { tutorials, fixCamera } from '../../utils/data';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

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

const TutorialCard = styled(Card)`
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

const Tutorials = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [activeNav, setActiveNav] = useState('tutorials');

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
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#2D3748' }}>Tutorials</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#718096' }}>Learn how to get the most out of YogiHive</Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TutorialCard>
                            <CardContent>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2D3748' }}>Basic Tutorials</Typography>
                                <List>
                                    {tutorials.map((tutorial, index) => (
                                        <ListItem key={index} sx={{ py: 1 }}>
                                            <ListItemIcon>
                                                <FaCheckCircle style={{ color: '#48BB78' }} />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={tutorial}
                                                primaryTypographyProps={{
                                                    sx: { color: '#4A5568', fontWeight: 500 }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </TutorialCard>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TutorialCard>
                            <CardContent>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2D3748' }}>Camera Troubleshooting</Typography>
                                <List>
                                    {fixCamera.map((point, index) => (
                                        <ListItem key={index} sx={{ py: 1 }}>
                                            <ListItemIcon>
                                                <FaExclamationTriangle style={{ color: '#F6AD55' }} />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={point}
                                                primaryTypographyProps={{
                                                    sx: { color: '#4A5568', fontWeight: 500 }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </TutorialCard>
                    </Grid>
                </Grid>

                <YogiJiButton onClick={() => setShowChatbot(true)} />
                {showChatbot && <YogiJiChatbot onClose={() => setShowChatbot(false)} />}
            </MainContent>
        </DashboardContainer>
    );
};

export default Tutorials;