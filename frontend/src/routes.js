import { Navigate } from 'react-router-dom';
import ChallengePage from './pages/Challenge/ChallengePage';
import MorningMeditation from './pages/tasks/MorningMeditation';
import YogaFlow from './pages/tasks/YogaFlow';
import WaterIntake from './pages/tasks/WaterIntake';
import GratitudeJournal from './pages/tasks/GratitudeJournal';
import EveningStretching from './pages/tasks/EveningStretching';
import Chatrooms from './pages/Chatrooms/Chatrooms';

const routes = [
  {
    path: '/',
    element: <Navigate to="/challenge" replace />
  },
  {
    path: '/challenge',
    element: <ChallengePage />
  },
  {
    path: '/tasks/meditation',
    element: <MorningMeditation />
  },
  {
    path: '/tasks/yoga',
    element: <YogaFlow />
  },
  {
    path: '/tasks/water',
    element: <WaterIntake />
  },
  {
    path: '/tasks/gratitude',
    element: <GratitudeJournal />
  },
  {
    path: '/tasks/stretching',
    element: <EveningStretching />
  },
  {
    path: '/Chatrooms',
    element: <Chatrooms />
  }
];

export default routes; 