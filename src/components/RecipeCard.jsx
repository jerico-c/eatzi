import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Zap, NotebookText } from 'lucide-react';

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

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={recipeTitle}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        const target = e.target;
                        target.onerror = null;
                        target.style.display = 'none';
                        const placeholderContainer = target.parentElement?.querySelector('.placeholder-image-container');
                        if (placeholderContainer) {
                            placeholderContainer.style.display = 'flex';
                        }
                    }}
                />
            ) : null}
            <div
                className="placeholder-image-container w-full h-48 bg-green-100 flex items-center justify-center text-green-500"
                style={{ display: imageUrl ? 'none' : 'flex' }}
            >
                {/* Placeholder sengaja dikosongkan sesuai desain awal */}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-green-700 mb-2 truncate" title={recipeTitle}>
                        {recipeTitle}
                    </h3>

                    {/* Memberikan tinggi minimum untuk menjaga konsistensi ruang */}
                    <div className="text-xs text-gray-500 mb-3 space-y-1 min-h-[2.25rem]">
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

                    {/* Memberikan tinggi tetap pada paragraf bahan dan menyembunyikan teks berlebih */}
                    <p className="text-sm text-gray-600 mb-4 h-14 overflow-hidden">
                        <span className="font-medium">Bahan Utama:</span> {truncateText(recipe.Ingredients)}
                    </p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                    <Link
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