import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome, FaRunning, FaTrophy, FaBook, FaSignOutAlt, FaChartLine, FaUser, FaEnvelope, FaEdit, FaCamera, FaLock, FaUnlock, FaSave, FaTimes
} from 'react-icons/fa';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, Avatar, Divider } from '@mui/material';

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

const ProfileCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.08);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  border: 4px solid #667eea;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
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

const EditButton = styled(Button)`
  border-radius: 12px;
  padding: 10px 24px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeNav, setActiveNav] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goals: '',
    experience: '',
    preferences: '',
    medicalHistory: '',
    injuries: '',
    medications: '',
    allergies: '',
    emergencyContact: '',
    relationship: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    timeZone: '',
    language: '',
    notifications: '',
    privacy: '',
    theme: '',
    accessibility: '',
    subscription: '',
    payment: '',
    billing: '',
    plan: '',
    status: '',
    startDate: '',
    endDate: '',
    renewal: '',
    cancellation: '',
    refund: '',
    support: '',
    feedback: '',
    rating: '',
    review: '',
    referral: '',
    social: '',
    achievements: '',
    badges: '',
    points: '',
    level: '',
    rank: '',
    progress: '',
    history: '',
    stats: '',
    logs: '',
    reports: '',
    settings: '',
    account: '',
    security: '',
    about: '',
    terms: '',
    policy: '',
    cookies: '',
    license: '',
    version: '',
    update: '',
    backup: '',
    restore: '',
    delete: ''
  });

  useEffect(() => {
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  const handleCancel = () => {
    // Reload from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <NavItem 
          onClick={() => { setActiveNav('dashboard'); navigate('/dashboard'); }} 
          active={activeNav === 'dashboard'}
        >
          <FaHome />
          <NavText>Dashboard</NavText>
        </NavItem>
        <NavItem 
          onClick={() => { setActiveNav('progress'); navigate('/progress'); }} 
          active={activeNav === 'progress'}
        >
          <FaChartLine />
          <NavText>Progress</NavText>
        </NavItem>
        <NavItem 
          onClick={() => { setActiveNav('achievements'); navigate('/achievements'); }} 
          active={activeNav === 'achievements'}
        >
          <FaTrophy />
          <NavText>Achievements</NavText>
        </NavItem>
        <NavItem 
          onClick={() => { setActiveNav('profile'); navigate('/profile'); }} 
          active={activeNav === 'profile'}
        >
          <FaUser />
          <NavText>Profile</NavText>
        </NavItem>
        <NavItem 
          onClick={() => { setActiveNav('tutorials'); navigate('/tutorials'); }} 
          active={activeNav === 'tutorials'}
        >
          <FaBook />
          <NavText>Tutorials</NavText>
        </NavItem>
        <NavItem 
          onClick={() => { setActiveNav('about'); navigate('/about'); }} 
          active={activeNav === 'about'}
        >
          <FaBook />
          <NavText>About</NavText>
        </NavItem>
        <NavItem 
          onClick={() => { setActiveNav('contact'); navigate('/contact'); }} 
          active={activeNav === 'contact'}
        >
          <FaEnvelope />
          <NavText>Contact</NavText>
        </NavItem>
        <NavItem onClick={handleLogout}>
          <FaSignOutAlt />
          <NavText>Logout</NavText>
        </NavItem>
      </Sidebar>

      <MainContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#2D3748' }}>Your Profile</Typography>
          <Typography variant="subtitle1" sx={{ color: '#718096' }}>Manage your personal information and preferences</Typography>
        </Box>

        {saveSuccess && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            backgroundColor: '#4caf50', 
            color: 'white', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="body1">Profile changes saved successfully!</Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ProfileCard>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                  <StyledAvatar src={user?.photoURL || '/path-to-avatar.jpg'} alt="Profile" />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      minWidth: 'auto',
                      p: 1,
                      borderRadius: '50%'
                    }}
                  >
                    <FaCamera />
                  </Button>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#2D3748' }}>
                  {profileData.name || user?.displayName || 'User Name'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
                  {profileData.email || user?.email || 'user@example.com'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <EditButton
                    variant="contained"
                    color="primary"
                    startIcon={isEditing ? <FaSave /> : <FaEdit />}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </EditButton>
                  {isEditing && (
                    <EditButton
                      variant="outlined"
                      color="secondary"
                      startIcon={<FaTimes />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </EditButton>
                  )}
                </Box>
              </CardContent>
            </ProfileCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <ProfileCard>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2D3748' }}>Personal Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Age"
                      name="age"
                      value={profileData.age}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Gender"
                      name="gender"
                      value={profileData.gender}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Height"
                      name="height"
                      value={profileData.height}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Weight"
                      name="weight"
                      value={profileData.weight}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Experience Level"
                      name="experience"
                      value={profileData.experience}
                      onChange={handleChange}
                      disabled={!isEditing}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Goals"
                      name="goals"
                      value={profileData.goals}
                      onChange={handleChange}
                      disabled={!isEditing}
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </ProfileCard>
          </Grid>
        </Grid>
      </MainContent>
    </DashboardContainer>
  );
};

export default Profile; 