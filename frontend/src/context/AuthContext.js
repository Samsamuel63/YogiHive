import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Find the complete user data from users array
      const completeUserData = JSON.parse(storedUsers).find(u => u.id === userData.id);
      if (completeUserData) {
        setUser(completeUserData);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData = {
        ...foundUser,
        progress: foundUser.progress || {
          completedLevels: [],
          dailyTasks: [],
          achievements: []
        }
      };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify({ id: userData.id }));
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      progress: {
        completedLevels: [],
        dailyTasks: [],
        achievements: []
      }
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return true;
  };

  const updateUserProgress = (userId, progressData) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          progress: {
            ...u.progress,
            ...progressData
          }
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current user if it's the same user
    if (user && user.id === userId) {
      const updatedUser = {
        ...user,
        progress: {
          ...user.progress,
          ...progressData
        }
      };
      setUser(updatedUser);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      updateUserProgress,
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 