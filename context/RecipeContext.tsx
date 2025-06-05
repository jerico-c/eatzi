
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Recipe, Ingredient, DietaryPreference, getFilteredRecipes } from '../utils/mockData';

interface RecipeContextType {
  selectedIngredients: Ingredient[];
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (ingredientId: string) => void;
  dietaryPreferences: DietaryPreference[];
  togglePreference: (preference: DietaryPreference) => void;
  filteredRecipes: Recipe[];
  likeRecipe: (recipeId: string) => void;
  dislikeRecipe: (recipeId: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>(['all']);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  const addIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.some(i => i.id === ingredient.id)) {
      const updatedIngredients = [...selectedIngredients, ingredient];
      setSelectedIngredients(updatedIngredients);
    }
  };
  
  const removeIngredient = (ingredientId: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingredientId));
  };
  
  const togglePreference = (preference: DietaryPreference) => {
    if (preference === 'all') {
      setDietaryPreferences(['all']);
      return;
    }
    
    const updatedPreferences = dietaryPreferences.includes(preference)
      ? dietaryPreferences.filter(p => p !== preference)
      : [...dietaryPreferences.filter(p => p !== 'all'), preference];
    
    setDietaryPreferences(updatedPreferences.length ? updatedPreferences : ['all']);
  };
  
  const likeRecipe = (recipeId: string) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, likes: recipe.likes + 1 } 
          : recipe
      )
    );
  };
  
  const dislikeRecipe = (recipeId: string) => {
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
