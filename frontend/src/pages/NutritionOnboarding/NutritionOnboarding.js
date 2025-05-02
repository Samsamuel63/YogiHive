import React, { useState } from 'react';
import { Box, Button, Typography, Stepper, Step, StepLabel, TextField, MenuItem, Chip, Checkbox, FormControlLabel, FormGroup, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const goals = [
  'Lose Weight',
  'Gain Muscle',
  'Boost Energy',
  'Manage Diabetes',
  'Manage PCOS',
  'Clean Eating',
  'General Wellness'
];
const diets = [
  'Omnivore',
  'Non-Vegetarian',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Gluten-Free',
  'Dairy-Free'
];
const cuisines = [
  'Indian', 'Italian', 'Chinese', 'Mexican', 'Mediterranean', 'Thai', 'American', 'Japanese', 'French', 'Middle Eastern'
];
const allergies = [
  'Peanuts', 'Tree Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish', 'Wheat', 'Sesame', 'Dairy'
];
const conditions = [
  'Diabetes', 'PCOS', 'Hypertension', 'Thyroid', 'Celiac', 'IBS', 'None'
];

const Card = styled(Paper)`
  background: linear-gradient(135deg, #f5f7fa 60%, #e0e7ff 100%);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.10);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 500px;
  margin: 2rem auto;
`;

const StepContent = styled(motion.div)`
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NutritionOnboarding = () => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [diet, setDiet] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [calorieTarget, setCalorieTarget] = useState('');
  const [aiEstimate, setAiEstimate] = useState(false);
  const [specialConditions, setSpecialConditions] = useState([]);
  const navigate = useNavigate();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleDietChange = (d) => {
    setDiet(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };
  const handleCuisineChange = (c) => {
    setSelectedCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };
  const handleAllergyChange = (a) => {
    setSelectedAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };
  const handleConditionChange = (c) => {
    setSpecialConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const steps = [
    'Your Goal',
    'Diet & Preferences',
    'Calories',
    'Special Conditions'
  ];

  const handleFinish = () => {
    const data = {
      goal,
      diet,
      selectedCuisines,
      selectedAllergies,
      calorieTarget: aiEstimate ? 'AI_ESTIMATE' : calorieTarget,
      aiEstimate,
      specialConditions
    };
    localStorage.setItem('nutritionOnboarding', JSON.stringify(data));
    navigate('/nutrition/plan');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)', py: 6 }}>
      <Card elevation={4}>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepContent
              key="goal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>What is your main wellness goal?</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                {goals.map(g => (
                  <Chip
                    key={g}
                    label={g}
                    color={goal === g ? 'primary' : 'default'}
                    onClick={() => setGoal(g)}
                    sx={{ fontWeight: 600, fontSize: 16, px: 2, py: 1, borderRadius: 2, cursor: 'pointer' }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="contained" color="primary" disabled={!goal} onClick={handleNext}>Next</Button>
              </Box>
            </StepContent>
          )}
          {step === 1 && (
            <StepContent
              key="diet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Dietary Preferences & Allergies</Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Diet Types</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {diets.map(d => (
                  <Chip
                    key={d}
                    label={d}
                    color={diet.includes(d) ? 'primary' : 'default'}
                    onClick={() => handleDietChange(d)}
                    sx={{ fontWeight: 600, fontSize: 15, px: 2, py: 1, borderRadius: 2, cursor: 'pointer' }}
                  />
                ))}
              </Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Favorite Cuisines</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {cuisines.map(c => (
                  <Chip
                    key={c}
                    label={c}
                    color={selectedCuisines.includes(c) ? 'primary' : 'default'}
                    onClick={() => handleCuisineChange(c)}
                    sx={{ fontWeight: 600, fontSize: 15, px: 2, py: 1, borderRadius: 2, cursor: 'pointer' }}
                  />
                ))}
              </Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Allergies</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {allergies.map(a => (
                  <Chip
                    key={a}
                    label={a}
                    color={selectedAllergies.includes(a) ? 'primary' : 'default'}
                    onClick={() => handleAllergyChange(a)}
                    sx={{ fontWeight: 600, fontSize: 15, px: 2, py: 1, borderRadius: 2, cursor: 'pointer' }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="outlined" onClick={handleBack}>Back</Button>
                <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
              </Box>
            </StepContent>
          )}
          {step === 2 && (
            <StepContent
              key="calories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Calorie Target</Typography>
              <FormGroup sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Checkbox checked={aiEstimate} onChange={e => setAiEstimate(e.target.checked)} />}
                  label="Let AI estimate my calorie needs"
                />
              </FormGroup>
              {!aiEstimate && (
                <TextField
                  label="Daily Calorie Target"
                  type="number"
                  value={calorieTarget}
                  onChange={e => setCalorieTarget(e.target.value)}
                  sx={{ mb: 2 }}
                  fullWidth
                  inputProps={{ min: 800, max: 6000 }}
                />
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="outlined" onClick={handleBack}>Back</Button>
                <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
              </Box>
            </StepContent>
          )}
          {step === 3 && (
            <StepContent
              key="conditions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Special Conditions</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                {conditions.map(c => (
                  <Chip
                    key={c}
                    label={c}
                    color={specialConditions.includes(c) ? 'primary' : 'default'}
                    onClick={() => handleConditionChange(c)}
                    sx={{ fontWeight: 600, fontSize: 16, px: 2, py: 1, borderRadius: 2, cursor: 'pointer' }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="outlined" onClick={handleBack}>Back</Button>
                <Button variant="contained" color="success" onClick={handleFinish}>Finish</Button>
              </Box>
            </StepContent>
          )}
        </AnimatePresence>
      </Card>
    </Box>
  );
};

export default NutritionOnboarding; 