import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 2rem;
`;

const Login = () => {
  const navigate = useNavigate();

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <LoginContainer>
      <LoginForm onSwitch={handleSwitchToRegister} />
    </LoginContainer>
  );
};

export default Login; 