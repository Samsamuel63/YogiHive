import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

console.log('Gemini API Key:', process.env.REACT_APP_GEMINI_API_KEY);

const estimateCalories = (goal) => {
  switch ((goal || '').toLowerCase()) {
    case 'lose weight':
      return 1600;
    case 'gain muscle':
      return 2500;
    case 'boost energy':
      return 2100;
    case 'manage diabetes':
      return 1800;
    case 'manage pcos':
      return 1700;
    case 'clean eating':
      return 2000;
    case 'general wellness':
    default:
      return 2000;
  }
};

const generateMealPlan = async (userPreferences) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    const isNonVeg = userPreferences.diet?.some(d => /non[- ]?veg(etarian)?|unrestricted|omnivore/i.test(d));

    // If calorieTarget is 'AI_ESTIMATE', estimate based on goal
    let calorieTarget = userPreferences.calorieTarget;
    if (calorieTarget === 'AI_ESTIMATE') {
      calorieTarget = estimateCalories(userPreferences.goal);
    }

    const prompt = `
      Generate a personalized meal plan based on the following user preferences:
      - Goal: ${userPreferences.goal}
      - Diet: ${userPreferences.diet.join(', ')}
      - Calorie Target: ${calorieTarget}
      - Allergies: ${userPreferences.selectedAllergies.join(', ')}
      - Special Conditions: ${userPreferences.specialConditions.join(', ')}
      ${isNonVeg ? '\n      - The user is non-vegetarian. Include a variety of non-vegetarian meals (chicken, fish, eggs, etc.) as appropriate.' : ''}

      Please provide a structured response in JSON format with the following structure:
      {
        "meals": [
          {
            "name": "Meal Name",
            "time": "Breakfast/Lunch/Dinner/Snack/etc.",
            "description": "Brief description",
            "ingredients": ["ingredient1", "ingredient2"],
            "macros": {
              "protein": number,
              "carbs": number,
              "fat": number
            },
            "micros": {
              "iron": number,
              "fiber": number,
              "vitaminD": number
            },
            "calories": number,
            "preparationTime": "X minutes",
            "difficulty": "Easy/Medium/Hard"
          }
        ],
        "totalCalories": number,
        "totalMacros": {
          "protein": number,
          "carbs": number,
          "fat": number
        }
      }

      Ensure the meal plan:
      1. Matches the user's dietary preferences and restrictions
      2. Stays within the calorie target
      3. Is nutritionally balanced
      4. Includes variety
      5. Is practical to prepare
      Respond ONLY with the JSON, no explanation or markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini response:', text);
    
    // Extract JSON block from Gemini response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```|({[\s\S]*})/);
    if (!jsonMatch) throw new Error('No JSON found in Gemini response');
    const jsonString = jsonMatch[1] || jsonMatch[2];
    console.log('Extracted JSON:', jsonString);

    const mealPlan = JSON.parse(jsonString);
    return mealPlan;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};

export { generateMealPlan }; 