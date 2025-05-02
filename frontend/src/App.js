import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './theme/theme';
import GlobalStyles from './theme/globalStyles';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Login from './pages/Login/Login';
import RegisterForm from './components/Auth/RegisterForm';
import Dashboard from './pages/Dashboard/Dashboard';
import Progress from './pages/Progress/Progress';
import Achievements from './pages/Achievements/Achievements';
import Profile from './pages/Profile/Profile';
import PrivateRoute from './components/Auth/PrivateRoute';
import Auth from './pages/Auth/Auth';
import Home from './pages/Home/Home';
import Yoga from './pages/Yoga/Yoga';
import About from './pages/About/About';
import Tutorials from './pages/Tutorials/Tutorials';
import Contact from './pages/Contact/Contact';
import Easy from './pages/Easy/Easy';
import Medium from './pages/Medium/Medium';
import Hard from './pages/Hard/Hard';
import ChallengePage from './pages/Challenge/ChallengePage';
import Chatrooms from './pages/Chatrooms/Chatrooms';

// Import task pages
import MorningMeditation from './pages/tasks/MorningMeditation';
import YogaFlow from './pages/tasks/YogaFlow';
import WaterIntake from './pages/tasks/WaterIntake';
import GratitudeJournal from './pages/tasks/GratitudeJournal';
import EveningStretching from './pages/tasks/EveningStretching';

import Level1 from './pages/Level/Easy/Level1/Level1';
import Level2 from './pages/Level/Easy/Level2/Level2';
import Level3 from './pages/Level/Easy/Level3/Level3';  
import Level4 from './pages/Level/Easy/Level4/Level4';
import Level5 from './pages/Level/Easy/Level5/Level5';
import Level6 from './pages/Level/Easy/Level6/Level6';
import Level7 from './pages/Level/Easy/Level7/Level7';
import Level8 from './pages/Level/Easy/Level8/Level8';
import Level9 from './pages/Level/Easy/Level9/Level9';
import Level10 from './pages/Level/Easy/Level10/Level10';

import LEVEL1 from './pages/Level/Medium/Level1/Level1';
import LEVEL2 from './pages/Level/Medium/Level2/Level2';
import LEVEL3 from './pages/Level/Medium/Level3/Level3';  
import LEVEL4 from './pages/Level/Medium/Level4/Level4';
import LEVEL5 from './pages/Level/Medium/Level5/Level5';
import LEVEL6 from './pages/Level/Medium/Level6/Level6';
import LEVEL7 from './pages/Level/Medium/Level7/Level7';
import LEVEL8 from './pages/Level/Medium/Level8/Level8';
import LEVEL9 from './pages/Level/Medium/Level9/Level9';
import LEVEL10 from './pages/Level/Medium/Level10/Level10';

import LeVeL1 from './pages/Level/Hard/Level1/Level1';
import LeVeL2 from './pages/Level/Hard/Level2/Level2';
import LeVeL3 from './pages/Level/Hard/Level3/Level3';  
import LeVeL4 from './pages/Level/Hard/Level4/Level4';
import LeVeL5 from './pages/Level/Hard/Level5/Level5';
import LeVeL6 from './pages/Level/Hard/Level6/Level6';
import LeVeL7 from './pages/Level/Hard/Level7/Level7';
import LeVeL8 from './pages/Level/Hard/Level8/Level8';
import LeVeL9 from './pages/Level/Hard/Level9/Level9';
import LeVeL10 from './pages/Level/Hard/Level10/Level10';

// import Profile from './pages/Profile/Profile';
import YogiJi from './pages/YogiJi/YogiJi';
import Scheduler from './pages/Scheduler/Scheduler';
import NutritionOnboarding from './pages/NutritionOnboarding/NutritionOnboarding';
import NutritionPlan from './pages/NutritionPlan/NutritionPlan';

import './App.css';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <PrivateRoute>
                    <Progress />
                  </PrivateRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <PrivateRoute>
                    <Achievements />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/start"
                element={
                  <PrivateRoute>
                    <Yoga />
                  </PrivateRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <PrivateRoute>
                    <About />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tutorials"
                element={
                  <PrivateRoute>
                    <Tutorials />
                  </PrivateRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <PrivateRoute>
                    <Contact />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Easy"
                element={
                  <PrivateRoute>
                    <Easy />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Medium"
                element={
                  <PrivateRoute>
                    <Medium />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Hard"
                element={
                  <PrivateRoute>
                    <Hard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/daily-challenge"
                element={
                  <PrivateRoute>
                    <ChallengePage />
                  </PrivateRoute>
                }
              />

              {/* Task Routes */}
              <Route
                path="/tasks/morning-meditation"
                element={
                  <PrivateRoute>
                    <MorningMeditation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks/yoga-flow"
                element={
                  <PrivateRoute>
                    <YogaFlow />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks/water-intake"
                element={
                  <PrivateRoute>
                    <WaterIntake />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks/gratitude-journal"
                element={
                  <PrivateRoute>
                    <GratitudeJournal />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks/evening-stretching"
                element={
                  <PrivateRoute>
                    <EveningStretching />
                  </PrivateRoute>
                }
              />

              {/* Easy Level Routes */}
              <Route
                path="/easy/level/1"
                element={
                  <PrivateRoute>
                    <Level1 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/easy/level/2"
                element={
                  <PrivateRoute>
                    <Level2 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/easy/level/3"
                element={
                  <PrivateRoute>
                    <Level3 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/easy/level/4"
                element={
                  <PrivateRoute>
                    <Level4 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/easy/level/5"
                element={
                  <PrivateRoute>
                    <Level5 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/easy/level/6"
                element={
                  <PrivateRoute>
                    <Level6 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/easy/level/7"
                element={
                  <PrivateRoute>
                    <Level7 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/easy/level/8"
                element={
                  <PrivateRoute>
                    <Level8 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/easy/level/9"
                element={
                  <PrivateRoute>
                    <Level9 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/easy/level/10"
                element={
                  <PrivateRoute>
                    <Level10 />
                  </PrivateRoute>
                }
              />

              {/* Medium Level Routes */}
              <Route
                path="/medium/level/1"
                element={
                  <PrivateRoute>
                    <LEVEL1 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medium/level/2"
                element={
                  <PrivateRoute>
                    <LEVEL2 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medium/level/3"
                element={
                  <PrivateRoute>
                    <LEVEL3 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medium/level/4"
                element={
                  <PrivateRoute>
                    <LEVEL4 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medium/level/5"
                element={
                  <PrivateRoute>
                    <LEVEL5 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medium/level/6"
                element={
                  <PrivateRoute>
                    <LEVEL6 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medium/level/7"
                element={
                  <PrivateRoute>
                    <LEVEL7 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medium/level/8"
                element={
                  <PrivateRoute>
                    <LEVEL8 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medium/level/9"
                element={
                  <PrivateRoute>
                    <LEVEL9 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medium/level/10"
                element={
                  <PrivateRoute>
                    <LEVEL10 />
                  </PrivateRoute>
                }
              />

              {/* Hard Level Routes */}
              <Route
                path="/hard/level/1"
                element={
                  <PrivateRoute>
                    <LeVeL1 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hard/level/2"
                element={
                  <PrivateRoute>
                    <LeVeL2 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hard/level/3"
                element={
                  <PrivateRoute>
                    <LeVeL3 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hard/level/4"
                element={
                  <PrivateRoute>
                    <LeVeL4 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hard/level/5"
                element={
                  <PrivateRoute>
                    <LeVeL5 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hard/level/6"
                element={
                  <PrivateRoute>
                    <LeVeL6 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hard/level/7"
                element={
                  <PrivateRoute>
                    <LeVeL7 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hard/level/8"
                element={
                  <PrivateRoute>
                    <LeVeL8 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hard/level/9"
                element={
                  <PrivateRoute>
                    <LeVeL9 />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hard/level/10"
                element={
                  <PrivateRoute>
                    <LeVeL10 />
                  </PrivateRoute>
                }
              />

              <Route
                path="/yogi-ji"
                element={
                  <PrivateRoute>
                    <YogiJi />
                  </PrivateRoute>
                }
              />
              <Route
                path="/scheduler"
                element={
                  <PrivateRoute>
                    <Scheduler />
                  </PrivateRoute>
                }
              />
              <Route
                path="/nutrition-onboarding"
                element={
                  <PrivateRoute>
                    <NutritionOnboarding />
                  </PrivateRoute>
                }
              />
              <Route
                path="/nutrition/plan"
                element={
                  <PrivateRoute>
                    <NutritionPlan />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Chatrooms"
                element={
                  <PrivateRoute>
                    <Chatrooms />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
