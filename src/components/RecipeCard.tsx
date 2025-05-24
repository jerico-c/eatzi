
import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../utils/mockData';
import { Clock, Users } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full card-hover">
        <div className="relative h-48">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-foodie-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {recipe.nutritionInfo.calories} cal
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-800">{recipe.title}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Clock size={16} className="mr-1" />
            <span>{recipe.prepTime + recipe.cookTime} mins</span>
            <Users size={16} className="ml-3 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.dietaryPreferences.map(pref => (
              <span 
                key={pref} 
                className="bg-foodie-100 text-foodie-800 text-xs px-2 py-1 rounded-full"
              >
                {pref}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <span className="text-green-600 font-medium">{recipe.likes} likes</span>
              <span className="mx-1">•</span>
              <span className="text-red-500 font-medium">{recipe.dislikes} dislikes</span>
            </div>
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
