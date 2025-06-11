import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes }) => {
  return (
    <div className="container mx-auto p-4">
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id || recipe.Title} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p>No recipes found. Try adjusting your filters or search terms.</p>
      )}
    </div>
  );
};

export default RecipeList;