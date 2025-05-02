import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${({ theme, error }) => error ? theme.colors.error : theme.colors.border};
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ErrorMessage = styled(motion.p)`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const Button = styled(motion.button)`
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
  }
`;

const SocialLoginContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialButton = styled(motion.button)`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}10;
  }
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Poppins', sans-serif;

  span {
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    font-weight: 500;
  }
`;

const ProgressBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const ProgressStep = styled.div`
  flex: 1;
  height: 4px;
  background: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.border};
  border-radius: 2px;
  transition: all 0.3s ease;
`;

const GoalContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const GoalCard = styled(motion.div)`
  padding: 1rem;
  border: 2px solid ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.inputBackground};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const GoalTitle = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const GoalDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  margin: 0.5rem 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RegisterForm = ({ onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const success = register({
        name,
        email,
        password
      });

      if (success) {
        addToast('Successfully registered!', 'success');
        navigate('/dashboard');
      } else {
        setError('Email already registered');
        addToast('Email already registered', 'error');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      addToast('Registration failed. Please try again.', 'error');
    }
  };

  const handleSocialLogin = (provider) => {
    // In a real application, you would implement social login here
    setError(`${provider} registration not implemented yet`);
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Create Account</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error}
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={error}
          />
        </InputGroup>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorMessage>
        )}
        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
        >
          Sign Up
        </Button>
        <SocialLoginContainer>
          <SocialButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialLogin('Google')}
            type="button"
          >
            <FaGoogle /> Google
          </SocialButton>
          <SocialButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialLogin('Apple')}
            type="button"
          >
            <FaApple /> Apple
          </SocialButton>
        </SocialLoginContainer>
        <SwitchText>
          Already have an account? <span onClick={onSwitch}>Sign In</span>
        </SwitchText>
      </Form>
    </FormContainer>
  );
};

export default RegisterForm; 