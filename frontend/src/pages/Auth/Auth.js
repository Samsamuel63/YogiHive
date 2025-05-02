import React, { useState } from 'react';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import AuthLayout from '../../components/Auth/AuthLayout';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      {isLogin ? (
        <LoginForm onSwitch={() => setIsLogin(false)} onSuccess={handleAuthSuccess} />
      ) : (
        <RegisterForm onSwitch={() => setIsLogin(true)} onSuccess={handleAuthSuccess} />
      )}
    </AuthLayout>
  );
};

export default Auth; 