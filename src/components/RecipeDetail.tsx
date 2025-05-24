
import React, { useState } from 'react';
import { Recipe } from '../utils/mockData';
import { Clock, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRecipe } from '../context/RecipeContext';
import { toast } from 'sonner';

interface RecipeDetailProps {
  recipe: Recipe;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const { likeRecipe, dislikeRecipe } = useRecipe();
  const [hasVoted, setHasVoted] = useState(false);
  
  const handleLike = () => {
    if (!hasVoted) {
      likeRecipe(recipe.id);
      setHasVoted(true);
      toast.success('Thanks for your feedback!');
    } else {
      toast.info('You have already voted on this recipe');
    }
  };
  
  const handleDislike = () => {
    if (!hasVoted) {
      dislikeRecipe(recipe.id);
      setHasVoted(true);
      toast.success('Thanks for your feedback!');
    } else {
      toast.info('You have already voted on this recipe');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-64 sm:h-80">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.dietaryPreferences.map(pref => (
            <span 
              key={pref}
              className="bg-foodie-100 text-foodie-800 px-3 py-1 rounded-full text-sm"
            >
              {pref}
            </span>
          ))}
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{recipe.title}</h1>
        
        <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
          <div className="flex items-center">
            <Clock className="mr-2" size={18} />
            <div>
              <p className="font-medium">Time</p>
              <p>{recipe.prepTime + recipe.cookTime} mins</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="mr-2" size={18} />
            <div>
              <p className="font-medium">Servings</p>
              <p>{recipe.servings}</p>
            </div>
          </div>
        </div>
        
        {/* Nutrition Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Nutrition Information</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="text-center p-2">
                <p className="text-gray-500 text-sm">Calories</p>
                <p className="font-bold text-lg">{recipe.nutritionInfo.calories}</p>
              </div>
              <div className="text-center p-2">
                <p className="text-gray-500 text-sm">Protein</p>
                <p className="font-bold text-lg">{recipe.nutritionInfo.protein}g</p>
              </div>
              <div className="text-center p-2">
                <p className="text-gray-500 text-sm">Carbs</p>
                <p className="font-bold text-lg">{recipe.nutritionInfo.carbs}g</p>
              </div>
              <div className="text-center p-2">
                <p className="text-gray-500 text-sm">Fat</p>
                <p className="font-bold text-lg">{recipe.nutritionInfo.fat}g</p>
              </div>
              <div className="text-center p-2">
                <p className="text-gray-500 text-sm">Fiber</p>
                <p className="font-bold text-lg">{recipe.nutritionInfo.fiber}g</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
          <ul className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-2">
            {recipe.ingredients.map((ingredient) => (
              <li 
                key={ingredient.id}
                className="bg-white border border-gray-200 px-3 py-2 rounded-full text-gray-700 flex items-center"
              >
                {ingredient.image && (
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.name} 
                    className="w-6 h-6 rounded-full object-cover mr-2"
                  />
                )}
                {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="bg-foodie-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-700">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
        
        {/* Feedback */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">Rate this recipe</h2>
          <div className="flex gap-4">
            <button
              onClick={handleLike}
              disabled={hasVoted}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-colors ${
                hasVoted ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <ThumbsUp size={18} />
              <span>{recipe.likes} Likes</span>
            </button>
            
            <button
              onClick={handleDislike}
              disabled={hasVoted}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-colors ${
                hasVoted ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <ThumbsDown size={18} />
              <span>{recipe.dislikes} Dislikes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
