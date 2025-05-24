
import React from 'react';
import Header from '../components/Header';
import RecipeList from '../components/RecipeList';
import { useRecipe } from '../context/RecipeContext';
import { X } from 'lucide-react';

const Recipes = () => {
  const { selectedIngredients, removeIngredient } = useRecipe();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {selectedIngredients.length > 0 && (
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center">
              <span className="text-gray-600 mr-3">Selected ingredients:</span>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map(ingredient => (
                  <div 
                    key={ingredient.id}
                    className="bg-foodie-200 text-foodie-800 px-3 py-1 rounded-full flex items-center gap-1.5"
                  >
                    <span>{ingredient.name}</span>
                    <button 
                      onClick={() => removeIngredient(ingredient.id)}
                      className="text-foodie-500 hover:text-foodie-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <RecipeList />
    </div>
  );
};

export default Recipes;
