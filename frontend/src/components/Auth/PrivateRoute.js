import React from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const StyledPrivateRoute = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
`;

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <StyledPrivateRoute>{children}</StyledPrivateRoute> : <Navigate to="/" />;
};

export default PrivateRoute; 