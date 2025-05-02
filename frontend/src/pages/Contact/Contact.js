import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome, FaRunning, FaTrophy, FaBook, FaSignOutAlt, FaChartLine, FaUser, FaEnvelope, FaPlayCircle
} from 'react-icons/fa';
import { Box, Typography, Card, CardContent, Grid, TextField, Button } from '@mui/material';

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
const ContactCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
  transition: all 0.3s ease;
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
const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgba(102, 126, 234, 0.5);
    }
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #667eea;
    }
  }
`;

export default function Contact() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#2D3748' }}>Get in Touch</Typography>
          <Typography variant="subtitle1" sx={{ color: '#718096' }}>We are here to help! Reach out with your queries, suggestions, or feedback.</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ContactCard>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2D3748' }}>Send us a Message</Typography>
                <form action="https://api.web3forms.com/submit" method="POST">
                  <input type="hidden" name="access_key" value="a7fd98bb-a3f1-4d4f-b81e-f5b1d72620b7" />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: '12px',
                          padding: '12px 24px',
                          fontWeight: 600,
                          textTransform: 'none',
                          width: '100%'
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </ContactCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ContactCard>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2D3748' }}>Connect With Us</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              </CardContent>
            </ContactCard>
          </Grid>
        </Grid>
      </MainContent>
    </DashboardContainer>
  );
}
