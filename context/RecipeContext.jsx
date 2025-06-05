
import React, { createContext, useContext, useState } from 'react';
import { getFilteredRecipes } from '../utils/mockData';

const RecipeContext = createContext(undefined);

export const RecipeProvider = ({ children }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [dietaryPreferences, setDietaryPreferences] = useState(['all']);
  const [recipes, setRecipes] = useState([]);
  
  const addIngredient = (ingredient) => {
    if (!selectedIngredients.some(i => i.id === ingredient.id)) {
      const updatedIngredients = [...selectedIngredients, ingredient];
      setSelectedIngredients(updatedIngredients);
    }
  };
  
  const removeIngredient = (ingredientId) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingredientId));
  };
  
  const togglePreference = (preference) => {
    if (preference === 'all') {
      setDietaryPreferences(['all']);
      return;
    }
    
    const updatedPreferences = dietaryPreferences.includes(preference)
      ? dietaryPreferences.filter(p => p !== preference)
      : [...dietaryPreferences.filter(p => p !== 'all'), preference];
    
    setDietaryPreferences(updatedPreferences.length ? updatedPreferences : ['all']);
  };
  
  const likeRecipe = (recipeId) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, likes: recipe.likes + 1 } 
          : recipe
      )
    );
  };
  
  const dislikeRecipe = (recipeId) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, dislikes: recipe.dislikes + 1 } 
          : recipe
      )
    );
  };
  
  // Get filtered recipes based on selected ingredients and dietary preferences
  const filteredRecipes = getFilteredRecipes(
    selectedIngredients.map(i => i.id),
    dietaryPreferences
  );
  
  const value = {
    selectedIngredients,
    addIngredient,
    removeIngredient,
    dietaryPreferences,
    togglePreference,
    filteredRecipes,
    likeRecipe,
    dislikeRecipe,
  };
  
  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};
