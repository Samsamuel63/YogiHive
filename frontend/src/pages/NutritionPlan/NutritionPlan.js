import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Chip, Avatar, IconButton, ToggleButtonGroup, ToggleButton, LinearProgress, CircularProgress, Alert } from '@mui/material';
import { FaSyncAlt, FaTint, FaUtensils, FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { generateMealPlan } from '../../services/geminiService';

const Card = styled(Paper)`
  background: linear-gradient(135deg, #f5f7fa 60%, #e0e7ff 100%);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.10);
  padding: 2rem 1.5rem;
  margin-bottom: 2rem;
`;

const MealCard = styled(motion(Paper))`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem 1.5rem;
  border-radius: 16px;
  margin-bottom: 1.2rem;
  background: #fff;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08);
`;

const HydrationBox = styled(Box)`
  background: linear-gradient(90deg, #e0e7ff 60%, #f5f7fa 100%);
  border-radius: 14px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const PortionGuide = styled(Box)`
  background: #f5f7fa;
  border-radius: 14px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const MEAL_ORDER = [
  'Breakfast',
  'Morning Snack',
  'Brunch',
  'Lunch',
  'Afternoon Snack',
  'Evening Snack',
  'Dinner',
  'Late Night Snack',
  'Snack',
];

const groupMealsByTime = (meals) => {
  const grouped = {};
  meals.forEach(meal => {
    const time = meal.time || 'Other';
    if (!grouped[time]) grouped[time] = [];
    grouped[time].push(meal);
  });
  return grouped;
};

const NutritionPlan = () => {
  const [view, setView] = useState('daily');
  const [hydration, setHydration] = useState(0);
  const [onboarding, setOnboarding] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedMeals, setCompletedMeals] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('nutritionOnboarding');
    if (data) {
      const parsedData = JSON.parse(data);
      setOnboarding(parsedData);
      fetchMealPlan(parsedData);
    }
  }, []);

  const fetchMealPlan = async (userPreferences) => {
    try {
      setLoading(true);
      setError(null);
      setCompletedMeals([]); // Reset completed meals on new plan
      const plan = await generateMealPlan(userPreferences);
      setMealPlan(plan);
    } catch (err) {
      setError('Failed to generate meal plan. Please try again.');
      console.error('Error fetching meal plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHydration = () => {
    setHydration(h => Math.min(h + 1, 8));
  };

  const handleRefreshMealPlan = () => {
    if (onboarding) {
      fetchMealPlan(onboarding);
    }
  };

  const handleAteMeal = (mealName) => {
    setCompletedMeals((prev) => prev.includes(mealName) ? prev : [...prev, mealName]);
  };

  // Calculate dynamic summary based on completed meals
  const summary = mealPlan?.meals?.reduce((acc, meal) => {
    if (completedMeals.includes(meal.name)) {
      acc.calories += meal.calories;
      acc.protein += meal.macros.protein;
      acc.carbs += meal.macros.carbs;
      acc.fat += meal.macros.fat;
    }
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const groupedMeals = mealPlan?.meals ? groupMealsByTime(mealPlan.meals) : {};

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
          <Button onClick={handleRefreshMealPlan} sx={{ mt: 2 }}>Try Again</Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)', py: 6 }}>
      <Card elevation={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>Your Daily Meal Plan</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, v) => v && setView(v)}
            >
              <ToggleButton value="daily"><FaCalendarDay /></ToggleButton>
              <ToggleButton value="weekly"><FaCalendarWeek /></ToggleButton>
              <ToggleButton value="monthly"><FaCalendarAlt /></ToggleButton>
            </ToggleButtonGroup>
            <IconButton color="primary" onClick={handleRefreshMealPlan}>
              <FaSyncAlt />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 2, color: '#555' }}>
          {onboarding ? `Goal: ${onboarding.goal} | Diet: ${onboarding.diet.join(', ')} | Calories: ${onboarding.calorieTarget}` : 'Personalized for you'}
        </Typography>
        <HydrationBox>
          <FaTint style={{ fontSize: 28, color: '#60A5FA' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#60A5FA' }}>Hydration</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[...Array(8)].map((_, i) => (
              <Button
                key={i}
                variant={i < hydration ? 'contained' : 'outlined'}
                color="info"
                size="small"
                sx={{ minWidth: 28, borderRadius: 2 }}
                onClick={handleHydration}
                disabled={i > hydration}
              >
                {i + 1}
              </Button>
            ))}
          </Box>
          <Typography variant="body2" sx={{ ml: 2, color: '#888' }}>{hydration}/8 glasses</Typography>
        </HydrationBox>
        <PortionGuide>
          <FaUtensils style={{ fontSize: 22, color: '#A78BFA' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#A78BFA' }}>Portion Guide:</Typography>
          <Chip label="Protein" color="success" sx={{ fontWeight: 600 }} />
          <Chip label="Carbs" color="info" sx={{ fontWeight: 600 }} />
          <Chip label="Fats" color="warning" sx={{ fontWeight: 600 }} />
          <Chip label="Fiber" color="primary" sx={{ fontWeight: 600 }} />
        </PortionGuide>
        {MEAL_ORDER.filter(time => groupedMeals[time]).map(time => (
          <Box key={time} sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#7c3aed', mb: 1 }}>{time}</Typography>
            {groupedMeals[time].map((meal, idx) => (
              <MealCard
                key={meal.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                style={{ background: completedMeals.includes(meal.name) ? '#e0ffe0' : '#fff' }}
              >
                <Avatar src={`https://source.unsplash.com/featured/?${meal.name.replace(/\s+/g, ',')}`} alt={meal.name} sx={{ width: 64, height: 64, mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{meal.name}</Typography>
                  <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                    {meal.time} • {meal.calories} kcal • {meal.preparationTime} • {meal.difficulty}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{meal.description}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                    {meal.ingredients.map((ingredient, i) => (
                      <Chip key={i} label={ingredient} size="small" />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                    <Chip label={`Protein: ${meal.macros.protein}g`} color="success" size="small" />
                    <Chip label={`Carbs: ${meal.macros.carbs}g`} color="info" size="small" />
                    <Chip label={`Fat: ${meal.macros.fat}g`} color="warning" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={`Iron: ${meal.micros.iron}mg`} color="primary" size="small" />
                    <Chip label={`Fiber: ${meal.micros.fiber}g`} color="primary" size="small" />
                    <Chip label={`Vit D: ${meal.micros.vitaminD}µg`} color="secondary" size="small" />
                  </Box>
                </Box>
                <Button
                  variant={completedMeals.includes(meal.name) ? 'contained' : 'outlined'}
                  color={completedMeals.includes(meal.name) ? 'success' : 'primary'}
                  onClick={() => handleAteMeal(meal.name)}
                  disabled={completedMeals.includes(meal.name)}
                  sx={{ ml: 2 }}
                >
                  {completedMeals.includes(meal.name) ? 'Ate!' : 'Ate this meal'}
                </Button>
              </MealCard>
            ))}
          </Box>
        ))}
        {mealPlan && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Completed Meals Summary</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip label={`Calories: ${summary.calories}`} color="primary" />
              <Chip label={`Protein: ${summary.protein}g`} color="success" />
              <Chip label={`Carbs: ${summary.carbs}g`} color="info" />
              <Chip label={`Fat: ${summary.fat}g`} color="warning" />
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default NutritionPlan; 