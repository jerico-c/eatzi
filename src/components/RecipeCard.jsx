// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Jika Anda ingin navigasi ke halaman detail
import { Heart, Zap, Utensils, NotebookText, Star } from 'lucide-react'; // Ikon

// Fungsi untuk membuat placeholder gambar sederhana
const PlaceholderImage = ({ title }) => {
    // Ambil inisial dari judul untuk ditampilkan di placeholder
    const initials = title ? title.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase() : 'R';
    return (
        <div className="w-full h-48 bg-green-100 flex items-center justify-center text-green-500">
            <span className="text-4xl font-bold">{initials}</span>
        </div>
    );
};

const RecipeCard = ({ recipe }) => {
    // Asumsikan recipe.Url adalah slug atau ID untuk routing jika ada
    // Jika tidak ada kolom 'Url' di CSV, Anda bisa membuat slug dari 'Title'
    // const recipeSlug = recipe.Url || recipe.Title.toLowerCase().replace(/\s+/g, '-');
    
    // Jika ada kolom Image_Name dan Anda menyimpannya di public/images/
    // const imageUrl = recipe.Image_Name ? `/images/${recipe.Image_Name}` : null;
    // Jika Image_Name adalah URL lengkap:
    const imageUrl = recipe.Image_Name || null; // Ganti ini jika ada kolom gambar

    // Batasi panjang deskripsi/bahan
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={recipe.Title}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} // Fallback jika gambar error
                />
            ) : null}
            {/* Placeholder akan muncul jika imageUrl null ATAU jika gambar gagal dimuat (jika onError di atas aktif) */}
            {(!imageUrl) && <PlaceholderImage title={recipe.Title} />}


            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-green-700 mb-2 truncate" title={recipe.Title}>
                    {recipe.Title}
                </h3>
                
                <div className="text-xs text-gray-500 mb-3 space-y-1">
                    {recipe.Kalori > 0 && (
                        <div className="flex items-center">
                            <Zap size={14} className="mr-1.5 text-yellow-500" />
                            <span>{Math.round(recipe.Kalori)} Kalori</span>
                        </div>
                    )}
                    {recipe.Loves > 0 && (
                        <div className="flex items-center">
                            <Heart size={14} className="mr-1.5 text-red-500" />
                            <span>{recipe.Loves.toLocaleString('id-ID')} Suka</span>
                        </div>
                    )}
                    {/* Menampilkan skor kemiripan (opsional, untuk debugging atau info) */}
                    {/* <div className="flex items-center">
                        <Star size={14} className="mr-1.5 text-blue-500" />
                        <span>Skor: {recipe.score ? recipe.score.toFixed(2) : 'N/A'}</span>
                    </div> */}
                </div>

                <p className="text-sm text-gray-600 mb-4 flex-grow">
                    <span className="font-medium">Bahan Utama:</span> {truncateText(recipe.Ingredients, 70)}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-200">
                     {/*
                        Jika Anda memiliki halaman detail resep, gunakan Link.
                        Misalnya, jika route Anda adalah /resep/:slug_resep
                        <Link
                            to={`/resep/${recipeSlug}`} // Sesuaikan path dan parameter
                            className="w-full text-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 flex items-center justify-center"
                        >
                            <NotebookText size={18} className="mr-2" />
                            Lihat Detail Resep
                        </Link>
                    */}
                   <button
                        onClick={() => alert(`Detail untuk: ${recipe.Title}\n\nBahan:\n${recipe.Ingredients}\n\nLangkah:\n${recipe.Steps}`)}
                        className="w-full text-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 flex items-center justify-center"
                   >
                        <NotebookText size={18} className="mr-2" />
                        Tampilkan Info (Sementara)
                   </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;