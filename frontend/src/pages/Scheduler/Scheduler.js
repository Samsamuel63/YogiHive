import React, { useState, useEffect, useRef } from 'react';
import DailyScheduler from '../../components/DailyScheduler/DailyScheduler';
import { Box, Button, Typography, Modal, Paper, MenuItem, Select, InputLabel, FormControl, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { motion } from 'framer-motion';
import { FaRegClock, FaSpa, FaLock } from 'react-icons/fa';

// Helper to get tasks from localStorage (for demo, you may want to sync with DailyScheduler state in a real app)
function getStoredTasks() {
  try {
    const tasks = JSON.parse(localStorage.getItem('dailySchedulerTasks') || '[]');
    return Array.isArray(tasks) ? tasks : [];
  } catch {
    return [];
  }
}

function setStoredTasks(tasks) {
  localStorage.setItem('dailySchedulerTasks', JSON.stringify(tasks));
}

const Confetti = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 3000 }}
  >
    {/* Simple confetti effect using emojis for demo */}
    {[...Array(30)].map((_, i) => (
      <motion.span
        key={i}
        initial={{ x: Math.random() * window.innerWidth, y: -40, rotate: 0 }}
        animate={{ y: window.innerHeight + 40, rotate: 360 }}
        transition={{ duration: 2 + Math.random() * 1.5, delay: Math.random() * 0.5 }}
        style={{
          position: 'absolute',
          fontSize: 32,
          left: 0,
          top: 0,
          color: ['#6EE7B7', '#60A5FA', '#FBBF24', '#A78BFA'][i % 4],
          filter: 'drop-shadow(0 2px 4px #0002)'
        }}
      >
        🎉
      </motion.span>
    ))}
  </motion.div>
);

const FocusOverlay = ({ open, onClose, task, duration }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const overlayRef = useRef();

  // Prevent keyboard shortcuts and navigation
  useEffect(() => {
    if (!open) return;
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    window.addEventListener('keydown', prevent, true);
    window.addEventListener('popstate', prevent, true);
    return () => {
      window.removeEventListener('keydown', prevent, true);
      window.removeEventListener('popstate', prevent, true);
    };
  }, [open]);

  // Auto-mark task as complete and show confetti when timer ends
  const handleTimerEnd = () => {
    if (task) {
      const tasks = getStoredTasks();
      const idx = tasks.findIndex(t => t.id === task.id);
      if (idx !== -1) {
        tasks[idx].completed = true;
        setStoredTasks(tasks);
      }
    }
    setCompleted(true);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      onClose();
    }, 2500);
  };

  // Prevent closing by Escape or clicking outside
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} disableEscapeKeyDown disableBackdropClick>
      <Box
        ref={overlayRef}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(102,126,234,0.12)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Paper elevation={6} sx={{ p: 5, borderRadius: 6, minWidth: 340, textAlign: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)', position: 'relative' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <FaSpa style={{ fontSize: 48, color: '#60A5FA', marginBottom: 12 }} />
            <FaLock style={{ position: 'absolute', top: 18, right: 18, color: '#A78BFA', fontSize: 22 }} title="Session is locked" />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Focus Session</Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#667eea' }}>Stay focused on your task until the timer ends.</Typography>
            <Typography variant="h6" sx={{ color: '#764ba2', mb: 2 }}>{task?.title}</Typography>
            <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>{task?.description}</Typography>
            <FocusTimer duration={duration} onEnd={handleTimerEnd} disabled={completed} />
            <Typography variant="subtitle2" sx={{ mt: 3, color: '#A78BFA' }}>
              Mindfulness nudge: <b>Take a deep breath and relax your shoulders.</b>
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 4, borderRadius: 3 }} onClick={() => setShowConfirm(true)} disabled={completed}>End Focus</Button>
          </motion.div>
          {showConfetti && <Confetti />}
          <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
            <DialogTitle>End Focus Session?</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to end your focus session early?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowConfirm(false)} color="primary">Cancel</Button>
              <Button onClick={() => { setShowConfirm(false); onClose(); }} color="error">End Session</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Modal>
  );
};

const FocusTimer = ({ duration, onEnd, disabled }) => {
  const [seconds, setSeconds] = useState(duration || 25 * 60);
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!active || disabled) return;
    if (seconds === 0) {
      if (onEnd) onEnd();
      return;
    }
    const interval = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(interval);
  }, [active, seconds, disabled, onEnd]);
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <Box sx={{ fontSize: 36, fontWeight: 700, color: '#764ba2', mb: 1, letterSpacing: 2 }}>
        <FaRegClock style={{ marginRight: 8, color: '#60A5FA' }} />
        {min}:{sec}
      </Box>
      <Box>
        <Button variant="outlined" color="warning" sx={{ mr: 1, borderRadius: 3 }} onClick={() => setActive(false)} disabled={!active || disabled}>Pause</Button>
        <Button variant="outlined" color="success" sx={{ borderRadius: 3 }} onClick={() => setActive(true)} disabled={active || seconds === 0 || disabled}>Resume</Button>
      </Box>
    </Box>
  );
};

const TaskSelectModal = ({ open, onClose, onStart }) => {
  const [tasks, setTasks] = useState(getStoredTasks());
  const [selected, setSelected] = useState('');
  const [duration, setDuration] = useState(25);
  useEffect(() => {
    setTasks(getStoredTasks());
  }, [open]);
  const selectedTask = tasks.find(t => t.id === selected);
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', bgcolor: 'background.paper', p: 4, borderRadius: 4, minWidth: 340 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Select Task for Focus Session</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="task-select-label">Task</InputLabel>
          <Select
            labelId="task-select-label"
            value={selected}
            label="Task"
            onChange={e => setSelected(e.target.value)}
          >
            {tasks.map(task => (
              <MenuItem key={task.id} value={task.id}>{task.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Focus Duration (minutes)"
          type="number"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
          inputProps={{ min: 5, max: 180 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!selected}
          onClick={() => onStart(selectedTask, duration * 60)}
        >
          Start Focus Session
        </Button>
      </Box>
    </Modal>
  );
};

const Scheduler = () => {
  const [focusOpen, setFocusOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [focusTask, setFocusTask] = useState(null);
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  const handleStartFocus = (task, duration) => {
    setFocusTask(task);
    setFocusDuration(duration);
    setSelectOpen(false);
    setFocusOpen(true);
  };
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)', py: 6 }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>Daily Scheduler</Typography>
        <Button variant="contained" color="primary" sx={{ borderRadius: 3, fontWeight: 600, boxShadow: 2 }} onClick={() => setSelectOpen(true)}>
          Focus Session Mode
        </Button>
      </Box>
      <DailyScheduler />
      <TaskSelectModal open={selectOpen} onClose={() => setSelectOpen(false)} onStart={handleStartFocus} />
      <FocusOverlay open={focusOpen} onClose={() => setFocusOpen(false)} task={focusTask} duration={focusDuration} />
    </Box>
  );
};

export default Scheduler; 