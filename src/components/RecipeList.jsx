// src/components/RecipeList.jsx
import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes }) => {
    if (!recipes || recipes.length === 0) {
        return null; // Atau bisa tampilkan pesan jika diperlukan di sini, tapi sudah dihandle di IndexPage
    }

    return (
        <section aria-labelledby="recipe-list-heading">
            <h2 id="recipe-list-heading" className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 mt-8">
                Resep yang Direkomendasikan Untukmu:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe, index) => (
                    <RecipeCard key={recipe.Title + '-' + index} recipe={recipe} />
                ))}
            </div>
        </section>
    );
};

export default RecipeList;