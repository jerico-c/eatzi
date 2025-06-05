
import React from 'react';
import { useRecipe } from '../context/RecipeContext';
import RecipeCard from './RecipeCard';
import DietaryFilter from './DietaryFilter';

const RecipeList = () => {
  const { filteredRecipes, selectedIngredients } = useRecipe();

  return (
    <div className="container mx-auto px-4 py-8">
      <DietaryFilter />
      
      {selectedIngredients.length > 0 ? (
        <h2 className="text-xl font-semibold mb-4">
          Recipes with your ingredients ({filteredRecipes.length})
        </h2>
      ) : (
        <h2 className="text-xl font-semibold mb-4">
          All Recipes ({filteredRecipes.length})
        </h2>
      )}
      
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No recipes found</h3>
          <p className="text-gray-500">
            Try selecting different ingredients or dietary preferences
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
