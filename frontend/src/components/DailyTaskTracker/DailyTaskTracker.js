import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaFire, FaLeaf, FaHeart, FaBrain, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const TaskContainer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const TaskTitle = styled.h2`
  font-size: 1.8rem;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TaskCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${({ completed }) => 
    completed ? '#48bb78' : 'rgba(0, 0, 0, 0.1)'};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const TaskIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${({ completed }) => completed ? '#48bb78' : '#667eea'};
`;

const TaskName = styled.h3`
  font-size: 1.2rem;
  color: #2d3748;
  margin: 0 0 0.5rem;
`;

const TaskDescription = styled.p`
  font-size: 0.9rem;
  color: #718096;
  margin: 0 0 1rem;
`;

const TaskStatus = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ completed }) => completed ? '#48bb78' : '#718096'};
`;

const CompleteButton = styled(motion.button)`
  background: ${({ completed }) => completed ? '#48bb78' : '#667eea'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
`;

const TaskTimer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const DailyTaskTracker = ({ onTaskComplete }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Morning Meditation',
      description: 'Start your day with a 15-minute meditation session',
      icon: <FaBrain />,
      duration: 15,
      completed: false,
      path: '/tasks/morning-meditation'
    },
    {
      id: 2,
      name: 'Yoga Flow',
      description: 'Complete today\'s yoga sequence',
      icon: <FaFire />,
      duration: 30,
      completed: false,
      path: '/tasks/yoga-flow'
    },
    {
      id: 3,
      name: 'Healthy Meal',
      description: 'Prepare and enjoy a nutritious meal',
      icon: <FaLeaf />,
      duration: 20,
      completed: false,
      path: '/tasks/healthy-meal'
    },
    {
      id: 4,
      name: 'Gratitude Journal',
      description: 'Write down three things you\'re grateful for',
      icon: <FaHeart />,
      duration: 10,
      completed: false,
      path: '/tasks/gratitude-journal'
    }
  ]);

  useEffect(() => {
    // Check if tasks were already completed today
    const today = new Date().toISOString().split('T')[0];
    const completedTasks = user?.completedTasks || [];
    const todayCompletedTasks = completedTasks.filter(task => 
      task.completedAt && task.completedAt.split('T')[0] === today
    );

    setTasks(prevTasks => 
      prevTasks.map(task => ({
        ...task,
        completed: todayCompletedTasks.some(completedTask => completedTask.id === task.id)
      }))
    );
  }, [user]);

  const toggleTask = (taskId) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          if (newCompleted) {
            addToast('Task completed! Great job!', 'success');
            onTaskComplete(taskId, task.duration);
          }
          return { ...task, completed: newCompleted };
        }
        return task;
      });
      return updatedTasks;
    });
  };

  const handleTaskClick = (task) => {
    navigate(task.path);
  };

  return (
    <TaskContainer>
      <TaskHeader>
        <TaskTitle>Today's Challenges</TaskTitle>
      </TaskHeader>
      <TaskGrid>
        <AnimatePresence>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => handleTaskClick(task)}
              completed={task.completed}
            >
              <TaskIcon completed={task.completed}>
                {task.icon}
              </TaskIcon>
              <TaskName>{task.name}</TaskName>
              <TaskDescription>{task.description}</TaskDescription>
              <TaskTimer>
                <FaClock />
                {task.duration} minutes
              </TaskTimer>
              <TaskStatus completed={task.completed}>
                {task.completed ? (
                  <>
                    <FaCheck style={{ marginRight: '0.5rem' }} />
                    Completed
                  </>
                ) : (
                  <>
                    <FaTimes style={{ marginRight: '0.5rem' }} />
                    Pending
                  </>
                )}
              </TaskStatus>
              <CompleteButton
                completed={task.completed}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(task.id);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {task.completed ? 'Completed' : 'Mark as Complete'}
              </CompleteButton>
            </TaskCard>
          ))}
        </AnimatePresence>
      </TaskGrid>
    </TaskContainer>
  );
};

export default DailyTaskTracker; 