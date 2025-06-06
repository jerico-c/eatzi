// src/pages/Recipe.jsx (atau Recipe.tsx jika Anda menggunakan TypeScript)
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Navigate, Link } from 'react-router-dom'; // Tambahkan Link
import Header from '../components/Header'; 
import RecipeDetail from '../components/RecipeDetail'; 
import { useRecipe } from '../context/RecipeContext'; 
import recommendationService from '../services/recommendationService'; 
import { slugify } from '../lib/utils'; // Pastikan path util slugify benar
import { AlertTriangle, Home } from 'lucide-react'; // Untuk pesan error yang lebih baik

const RecipePage = () => {
  const { recipeSlug } = useParams(); 
  const location = useLocation(); 

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { filteredRecipes: contextRecipes, isServiceReady: isRecipeServiceReady } = useRecipe();

  useEffect(() => {
    const findRecipe = async () => {
      // console.log(`RecipePage: useEffect triggered for slug: ${recipeSlug}`);
      setLoading(true);
      setError(null);
      setRecipe(null); // Reset recipe state di awal pencarian baru
      let foundRecipe = null;

      try {
        if (location.state && location.state.recipeData) {
          // console.log("RecipePage: Trying to use location.state.recipeData", location.state.recipeData);
          const stateRecipeTitle = location.state.recipeData.Title || "";
          // Gunakan slugify yang konsisten
          if (slugify(stateRecipeTitle) === recipeSlug) {
            foundRecipe = location.state.recipeData;
            // console.log("RecipePage: Found in location.state");
          }
        }

        if (!foundRecipe && contextRecipes && contextRecipes.length > 0) {
          // console.log("RecipePage: Trying to find in contextRecipes");
          const recipeFromContext = contextRecipes.find(r => {
            if (!r || !r.Title) return false;
            return slugify(r.Title) === recipeSlug;
          });
          if (recipeFromContext) {
            foundRecipe = recipeFromContext;
            // console.log("RecipePage: Found in contextRecipes");
          }
        }

        if (!foundRecipe && isRecipeServiceReady) {
          // console.log("RecipePage: Trying to find in recommendationService");
          const serviceRecipeBySlug = await recommendationService.getRecipeBySlugOrTitle(recipeSlug);
          if (serviceRecipeBySlug) {
            foundRecipe = serviceRecipeBySlug;
            // console.log("RecipePage: Found in service by slug");
          } else {
            // console.log("RecipePage: Not found by slug, trying by title from slug");
            const potentialTitle = recipeSlug.replace(/-/g, ' ');
            const serviceRecipeByTitle = await recommendationService.findRecipeByTitle(potentialTitle);
            if (serviceRecipeByTitle) {
              foundRecipe = serviceRecipeByTitle;
              // console.log("RecipePage: Found in service by title derived from slug");
            }
          }
        }
      } catch (err) {
        console.error("RecipePage: Error during findRecipe logic:", err);
        setError(`Terjadi kesalahan saat mencari data resep: ${err.message}`);
      } finally {
        if (foundRecipe) {
          // console.log("RecipePage: Setting recipe state with:", foundRecipe);
          setRecipe(foundRecipe);
        } else if (!error) { // Hanya jika tidak ada error dari catch
          // console.log(`RecipePage: Recipe not found for slug: ${recipeSlug}. Error state will lead to 404 or message.`);
          setError(`Resep dengan slug "${recipeSlug}" tidak ditemukan.`); // Set error jika tidak ditemukan
        }
        setLoading(false);
        // console.log(`RecipePage: Loading finished. Recipe state:`, foundRecipe, "Error state:", error);
      }
    };

    findRecipe();
  }, [recipeSlug, location.state, contextRecipes, isRecipeServiceReady]); // Hapus `error` dari dependensi jika tidak ingin re-fetch karena perubahan error

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center text-xl text-gray-600">
                Memuat detail resep...
            </div>
        </div>
    );
  }

  // Jika ada error (termasuk resep tidak ditemukan), tampilkan pesan error
  if (error) {
     return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-8">
                <AlertTriangle size={60} className="text-red-500 mb-6" />
                <p className="text-2xl md:text-3xl font-semibold text-red-600 mb-4">Oops! Terjadi Kesalahan</p>
                <p className="text-lg text-gray-700 mb-8 max-w-md">{error}</p>
                <Link 
                    to="/" 
                    className="bg-foodie-500 hover:bg-foodie-600 text-white font-medium px-8 py-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out flex items-center"
                >
                    <Home size={20} className="mr-2" />
                    Kembali ke Halaman Utama
                </Link>
            </div>
        </div>
     );
  }

  // Jika tidak loading, tidak error, tapi resep tetap null (seharusnya sudah ditangani oleh setError di atas)
  // Pengecekan ini menjadi lapisan pengaman terakhir.
  if (!recipe) {
    // console.warn("RecipePage: Navigating to 404 because recipe is still null/undefined post-loading and no error state was caught prior.");
    return <Navigate to="/404" state={{ from: location }} replace />; 
  }

  // Jika sampai di sini, 'recipe' seharusnya adalah objek yang valid
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="py-4 md:py-6"> {/* Tambahkan sedikit padding jika perlu */}
        <RecipeDetail recipe={recipe} />
      </main>
    </div>
  );
};

export default RecipePage;