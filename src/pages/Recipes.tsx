// src/pages/Recipes.tsx
import React from 'react';
import Header from '../components/Header'; // Pastikan path ini benar, mungkin '../components/Header.tsx' atau sesuai struktur Anda
import RecipeList from '../components/RecipeList'; // Sama, pastikan path benar
import { useRecipe } from '../context/RecipeContext'; // Sama, pastikan path benar
import { X, ListX, Info } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

const Recipes: React.FC = () => {
  // 1. Ambil filteredRecipes dari context
  const { selectedIngredients, removeIngredient, filteredRecipes } = useRecipe();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {selectedIngredients.length > 0 && (
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center">
              <span className="text-gray-700 font-medium mr-3 mb-2 sm:mb-0">Bahan Dipilih:</span>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map(ingredient => (
                  <div 
                    key={ingredient.id}
                    className="bg-foodie-100 text-foodie-700 px-3 py-1.5 rounded-full flex items-center text-sm shadow-sm"
                  >
                    <span>{ingredient.name}</span>
                    <button 
                      onClick={() => removeIngredient(ingredient.id)}
                      className="ml-2 text-foodie-500 hover:text-foodie-700 focus:outline-none"
                      title={`Hapus ${ingredient.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {filteredRecipes && filteredRecipes.length > 0 ? (
          // 2. Kirim filteredRecipes ke RecipeList
          <RecipeList recipes={filteredRecipes} />
        ) : (
          <div className="text-center py-10 mt-6 bg-white border border-gray-200 p-8 rounded-lg shadow-md">
            {selectedIngredients.length > 0 ? (
              <>
                <ListX className="h-12 w-12 mx-auto mb-4 text-foodie-400" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tidak Ada Resep Ditemukan</h2>
                <p className="text-gray-500">
                  Kami tidak menemukan resep yang cocok dengan kombinasi bahan dan preferensi diet Anda.
                  <br />
                  Coba ubah pilihan bahan atau preferensi diet Anda di halaman utama.
                </p>
              </>
            ) : (
              <>
                <Info className="h-12 w-12 mx-auto mb-4 text-foodie-400" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Mulai Mencari Resep</h2>
                <p className="text-gray-500">
                  Pilih beberapa bahan di <Link to="/" className="text-foodie-600 hover:underline">halaman utama</Link> untuk melihat resep yang direkomendasikan di sini.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;