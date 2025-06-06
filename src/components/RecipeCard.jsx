// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Zap, NotebookText } from 'lucide-react';

const PlaceholderImage = ({ title }) => {
    const safeTitle = typeof title === 'string' ? title.trim() : '';
    const initials = safeTitle ? safeTitle.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase() : 'R';
    return (
        <div className="w-full h-48 bg-green-100 flex items-center justify-center text-green-500">
            <span className="text-4xl font-bold">{initials}</span>
        </div>
    );
};

const RecipeCard = ({ recipe }) => {
    const recipeTitle = (typeof recipe.Title === 'string' ? recipe.Title : "Judul Tidak Tersedia").trim();

    const recipeSlug = recipeTitle
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

    const imageUrl = recipe.Image_Name || null;

    const truncateText = (text, maxLength = 70) => {
        if (!text || typeof text !== 'string') return 'Bahan tidak tersedia';
        const trimmedText = text.trim();
        if (trimmedText.length <= maxLength) return trimmedText;
        return trimmedText.substring(0, maxLength) + '...';
    };

    const cardKey = recipe.id || recipeSlug || `recipe-${Math.random()}`;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={recipeTitle}
                    className="w-full h-48 object-cover"
                    onError={(e) => { 
                        // Di JavaScript, e.target sudah merupakan elemen HTML
                        const target = e.target; 
                        target.onerror = null; 
                        target.style.display = 'none';
                        // parentElement mungkin null, jadi gunakan optional chaining
                        const placeholderContainer = target.parentElement?.querySelector('.placeholder-image-container');
                        if (placeholderContainer) {
                            // Tidak perlu type assertion di JS
                            placeholderContainer.style.display = 'flex';
                        }
                    }}
                />
            ) : null}
            {/* Placeholder akan selalu ada di DOM tapi dikontrol oleh style.display */}
            <div 
                className="placeholder-image-container w-full h-48 bg-green-100 flex items-center justify-center text-green-500" 
                style={{ display: imageUrl ? 'none' : 'flex' }}
            >
                 <span className="text-4xl font-bold">
                    {recipeTitle.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-green-700 mb-2 truncate" title={recipeTitle}>
                    {recipeTitle}
                </h3>
                
                <div className="text-xs text-gray-500 mb-3 space-y-1">
                    {typeof recipe.Kalori === 'number' && recipe.Kalori > 0 && (
                        <div className="flex items-center">
                            <Zap size={14} className="mr-1.5 text-yellow-500" />
                            <span>{Math.round(recipe.Kalori)} Kalori</span>
                        </div>
                    )}
                    {typeof recipe.Loves === 'number' && recipe.Loves > 0 && (
                        <div className="flex items-center">
                            <Heart size={14} className="mr-1.5 text-red-500" />
                            <span>{recipe.Loves.toLocaleString('id-ID')} Suka</span>
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-600 mb-4 flex-grow">
                    <span className="font-medium">Bahan Utama:</span> {truncateText(recipe.Ingredients)}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-200">
                   <Link
                        key={cardKey}
                        to={`/resep/${recipeSlug}`} 
                        state={{ recipeData: recipe, fromRecipesPage: window.location.pathname === '/recipes' }}
                        className="w-full text-center bg-foodie-500 hover:bg-foodie-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 flex items-center justify-center"
                   >
                        <NotebookText size={18} className="mr-2" />
                        Lihat Detail Resep
                   </Link>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;