
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
        <div className="relative h-48">
          <img 
            src={recipe.image || '/placeholder.svg'} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          {recipe.nutritionInfo && (
            <span className="absolute top-2 right-2 bg-foodie-500 text-white px-2 py-1 rounded-full text-xs">
              {recipe.nutritionInfo.calories} cal
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2 text-gray-800">{recipe.title}</h3>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {recipe.prepTime ? `${recipe.prepTime + (recipe.cookTime || 0)} mins` : 'Time N/A'}
            </div>
            <div className="text-sm text-gray-500">
              {recipe.servings ? `${recipe.servings} servings` : 'Servings N/A'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
