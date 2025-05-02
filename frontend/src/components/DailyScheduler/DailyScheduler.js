import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, MenuItem, IconButton, Paper, Chip, Tooltip } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaCheckCircle, FaRegClock, FaRedo, FaQuoteLeft } from 'react-icons/fa';
import styled from 'styled-components';

const categories = [
  { label: 'Health', color: '#6EE7B7' },
  { label: 'Work', color: '#60A5FA' },
  { label: 'Personal Growth', color: '#FBBF24' },
  { label: 'Mindfulness', color: '#A78BFA' },
];

const quotes = [
  'Small steps every day lead to big results.',
  'Your future is created by what you do today, not tomorrow.',
  'Wellness is the natural state of my body and mind.',
  'Focus on progress, not perfection.',
  'Breathe in calm, breathe out stress.',
  'You are your only limit.'
];

const SchedulerCard = styled(Paper)`
  background: linear-gradient(135deg, #f5f7fa 60%, #e0e7ff 100%);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.10);
  padding: 2.5rem 2rem 2rem 2rem;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const TaskInputRow = styled(Box)`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const TaskCard = styled(motion(Paper))`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border-radius: 14px;
  background: ${({ bgcolor }) => bgcolor || '#fff'};
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08);
  transition: box-shadow 0.3s;
`;

const CategoryChip = styled(Chip)`
  && {
    font-weight: 600;
    background: ${({ bgcolor }) => bgcolor || '#e0e7ff'};
    color: #333;
    margin-right: 0.5rem;
  }
`;

const AnimatedCheck = styled(motion.span)`
  color: #22c55e;
  font-size: 1.7rem;
  margin-left: 0.5rem;
`;

const MotivationalQuote = styled(Box)`
  font-size: 1.2rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const initialTasks = [];

const DailyScheduler = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due: '',
    category: categories[0].label,
    recurring: false
  });
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((q) => (q + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('dailySchedulerTasks');
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dailySchedulerTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    setTasks([
      ...tasks,
      {
        ...newTask,
        id: Date.now().toString(),
        completed: false
      }
    ]);
    setNewTask({ title: '', description: '', due: '', category: categories[0].label, recurring: false });
    setShowForm(false);
  };

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setTasks(reordered);
  };

  return (
    <SchedulerCard elevation={4}>
      <MotivationalQuote>
        <FaQuoteLeft style={{ opacity: 0.5 }} />
        <motion.span
          key={quoteIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
        >
          {quotes[quoteIdx]}
        </motion.span>
      </MotivationalQuote>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#764ba2', flex: 1 }}>Daily Scheduler</Typography>
        <Tooltip title="Add Another Task">
          <IconButton color="primary" onClick={() => setShowForm(f => !f)}>
            <FaPlus />
          </IconButton>
        </Tooltip>
      </Box>
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ marginBottom: 16 }}
          >
            <TaskInputRow>
              <TextField
                label="Title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                size="small"
                required
                sx={{ flex: 1, minWidth: 120 }}
              />
              <TextField
                label="Description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                size="small"
                sx={{ flex: 2, minWidth: 120 }}
              />
              <TextField
                label="Due"
                name="due"
                type="datetime-local"
                value={newTask.due}
                onChange={handleInputChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 160 }}
              />
              <TextField
                select
                label="Category"
                name="category"
                value={newTask.category}
                onChange={handleInputChange}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {categories.map(cat => (
                  <MenuItem key={cat.label} value={cat.label}>{cat.label}</MenuItem>
                ))}
              </TextField>
              <Button variant="contained" color="success" onClick={handleAddTask} sx={{ borderRadius: 3, fontWeight: 600, minWidth: 100 }}>Add</Button>
            </TaskInputRow>
          </motion.div>
        )}
      </AnimatePresence>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.length === 0 && (
                <Typography variant="body2" sx={{ color: '#aaa', textAlign: 'center', mt: 2 }}>No tasks yet. Add your first task!</Typography>
              )}
              {tasks.map((task, idx) => {
                const cat = categories.find(c => c.label === task.category);
                return (
                  <Draggable key={task.id} draggableId={task.id} index={idx}>
                    {(provided, snapshot) => (
                      <TaskCard
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        bgcolor={cat?.color + '22'}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: task.completed ? 0.6 : 1,
                          borderLeft: `6px solid ${cat?.color}`,
                          boxShadow: snapshot.isDragging ? '0 6px 24px #667eea22' : undefined
                        }}
                        initial={{ scale: 1 }}
                        animate={{ scale: snapshot.isDragging ? 1.03 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <CategoryChip label={task.category} bgcolor={cat?.color + 'cc'} />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{task.title}</Typography>
                            <Typography variant="body2" sx={{ color: '#555', opacity: 0.8 }}>{task.description}</Typography>
                            {task.due && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <FaRegClock style={{ fontSize: 14, marginRight: 4, color: '#667eea' }} />
                                <Typography variant="caption" sx={{ color: '#667eea' }}>{new Date(task.due).toLocaleString()}</Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {!task.completed && (
                            <Tooltip title="Mark as complete">
                              <IconButton color="success" onClick={() => handleCompleteTask(task.id)}>
                                <FaCheckCircle />
                              </IconButton>
                            </Tooltip>
                          )}
                          <AnimatePresence>
                            {task.completed && (
                              <AnimatedCheck
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              >
                                <FaCheckCircle />
                              </AnimatedCheck>
                            )}
                          </AnimatePresence>
                        </Box>
                      </TaskCard>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </SchedulerCard>
  );
};

export default DailyScheduler; 