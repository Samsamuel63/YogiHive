import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fade,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GratitudeJournal = () => {
  const [entries, setEntries] = useState(['', '', '']);
  const [previousEntries, setPreviousEntries] = useState([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const navigate = useNavigate();

  const prompts = [
    "What made you smile today?",
    "What's one thing you're looking forward to?",
    "Who made a positive impact on your day?",
    "What's a small win you achieved today?",
    "What's something beautiful you noticed today?",
    "What's a challenge you overcame today?",
    "What's something you're proud of?"
  ];

  // Load previous entries from localStorage
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem('gratitudeEntries');
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries);
        // Ensure parsedEntries is an array
        setPreviousEntries(Array.isArray(parsedEntries) ? parsedEntries : []);
      }
    } catch (error) {
      console.error('Error loading previous entries:', error);
      setPreviousEntries([]); // Set to empty array if there's an error
    }
  }, []);

  const handleEntryChange = (index, value) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const handleSubmit = () => {
    if (entries.every(entry => entry.trim())) {
      try {
        const today = new Date().toLocaleDateString();
        const newEntry = {
          date: today,
          entries: [...entries]
        };
        
        // Ensure previousEntries is an array before spreading
        const currentEntries = Array.isArray(previousEntries) ? previousEntries : [];
        const updatedEntries = [newEntry, ...currentEntries].slice(0, 7); // Keep last 7 days
        
        setPreviousEntries(updatedEntries);
        localStorage.setItem('gratitudeEntries', JSON.stringify(updatedEntries));
        
        // Update challenge progress
        const taskId = 4; // Gratitude Journal is task 4
        const savedCompletedTasks = localStorage.getItem('completedTasks');
        const currentDay = localStorage.getItem('currentDay');
        
        if (currentDay) {
          const completedTasks = savedCompletedTasks ? JSON.parse(savedCompletedTasks) : {};
          const taskKey = `day${currentDay}_task${taskId}`;
          
          if (!completedTasks[taskKey]) {
            completedTasks[taskKey] = true;
            localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
            
            const savedProgress = localStorage.getItem('challengeProgress');
            const newProgress = (parseInt(savedProgress) || 0) + 1;
            localStorage.setItem('challengeProgress', newProgress.toString());

            // Dispatch event to notify progress update
            window.dispatchEvent(new Event('challengeProgressUpdated'));
          }
        }
        
        // Show saved message
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 3000);
        
        // Reset form
        setEntries(['', '', '']);
      } catch (error) {
        console.error('Error saving entries:', error);
        // You could add error handling UI here if needed
      }
    }
  };

  const getRandomPrompt = () => {
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const handleReset = () => {
    localStorage.removeItem('completedTasks');
    localStorage.removeItem('challengeProgress');
    window.location.reload();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          📝 Daily Gratitude Journal
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: 'error.main',
              color: 'white',
            },
          }}
        >
          Reset Progress
        </Button>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 4,
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <AnimatePresence>
            {showSavedMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    py: 1,
                    px: 3,
                    bgcolor: 'success.light',
                    color: 'white',
                    borderRadius: '20px'
                  }}
                >
                  <Typography>
                    ✨ Gratitude entries saved successfully!
                  </Typography>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>

          <Typography 
            variant="h4" 
            gutterBottom 
            align="center"
            component={motion.h4}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            📝 Gratitude Journal
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ mb: 4 }} 
            align="center"
            color="text.secondary"
          >
            Take a moment to reflect on what you're grateful for today
          </Typography>

          <Box sx={{ mb: 4 }}>
            {entries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  label={`Gratitude ${index + 1}`}
                  value={entry}
                  onChange={(e) => handleEntryChange(index, e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder={getRandomPrompt()}
                  InputProps={{
                    endAdornment: (
                      <CreateIcon color="action" sx={{ mr: 1, opacity: 0.5 }} />
                    ),
                  }}
                />
              </motion.div>
            ))}
            
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleSubmit}
              disabled={!entries.every(entry => entry.trim())}
              startIcon={<SaveIcon />}
              sx={{ 
                mt: 2,
                height: 48,
                borderRadius: '24px',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                }
              }}
            >
              Save Today's Entries
            </Button>
          </Box>

          {Array.isArray(previousEntries) && previousEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Typography variant="h6" gutterBottom>
                Previous Entries
              </Typography>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'rgba(0,0,0,0.02)'
                }}
              >
                <List>
                  {previousEntries.map((day, index) => (
                    <React.Fragment key={day.date}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" color="primary">
                              {day.date}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {day.entries.map((entry, i) => (
                                <Typography 
                                  key={i} 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ 
                                    mb: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:before': {
                                      content: '"•"',
                                      marginRight: 1,
                                      color: 'primary.main'
                                    }
                                  }}
                                >
                                  {entry}
                                </Typography>
                              ))}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < previousEntries.length - 1 && (
                        <Divider component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </motion.div>
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/daily-challenge')}
              sx={{ mb: 4 }}
            >
              Back to Challenge
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default GratitudeJournal; 