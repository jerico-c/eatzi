// src/pages/Recipe.jsx (atau Recipe.tsx jika Anda menggunakan TypeScript)
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import Header from '../components/Header'; // Pastikan path benar
import RecipeDetail from '../components/RecipeDetail'; // Komponen yang menampilkan detail
import { useRecipe } from '../context/RecipeContext'; // Jika perlu fallback ke data konteks
import recommendationService from '../services/recommendationService'; // Jika perlu fallback ke data service

const RecipePage = () => {
  const { recipeSlug } = useParams(); // Mengambil slug dari URL, misal: /resep/:recipeSlug
  const location = useLocation(); // Untuk mengakses state yang dikirim melalui Link

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Akses data resep yang mungkin dikirim dari RecipeContext
  const { filteredRecipes: contextRecipes, isServiceReady: isRecipeServiceReady } = useRecipe();


  useEffect(() => {
    const findRecipe = async () => {
      setLoading(true);
      setError(null);

      // Prioritas 1: Ambil data dari Link state jika ada
      if (location.state && location.state.recipeData) {
        // Pastikan data dari state cocok dengan slug (sebagai validasi sederhana)
        const stateRecipeSlug = location.state.recipeData.Title
            ? location.state.recipeData.Title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
            : '';
        if (stateRecipeSlug === recipeSlug) {
            setRecipe(location.state.recipeData);
            setLoading(false);
            return;
        }
      }

      // Prioritas 2: Jika recommendationService sudah siap dan memiliki data, cari di sana
      // Ini berguna jika pengguna langsung membuka URL detail resep
      if (!recommendationService.isInitialized) {
        await recommendationService.init(); // Pastikan service diinisialisasi
      }

      if (recommendationService.isInitialized && recommendationService.recipesData.length > 0) {
        const foundRecipe = recommendationService.recipesData.find(
          (r) => (r.Title ? r.Title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : '') === recipeSlug
        );
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          setError("Resep tidak ditemukan di data layanan rekomendasi.");
        }
        setLoading(false);
        return;
      }
      
      // Prioritas 3: Coba cari di contextRecipes (jika berbeda atau sebagai fallback lain)
      // (Ini mungkin redundan jika contextRecipes juga dari recommendationService, tapi bisa berguna jika sumbernya beda)
      if (contextRecipes && contextRecipes.length > 0) {
         const foundInContext = contextRecipes.find(
            (r) => (r.Title ? r.Title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : '') === recipeSlug
         );
         if (foundInContext) {
            setRecipe(foundInContext);
            setLoading(false);
            return;
         }
      }

      // Jika semua sumber gagal dan service sudah dicoba inisialisasi
      if (!recipe && recommendationService.isInitialized) {
         setError("Resep tidak ditemukan setelah mencari di semua sumber data.");
      } else if (!recommendationService.isInitialized) {
         setError("Layanan resep belum siap sepenuhnya untuk mencari detail.");
      }
      setLoading(false);
    };

    if (recipeSlug) {
      findRecipe();
    } else {
      setError("Parameter resep tidak valid.");
      setLoading(false);
    }
  }, [recipeSlug, location.state, contextRecipes, isRecipeServiceReady]); // Tambahkan isRecipeServiceReady

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

  if (error) {
     return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <p className="text-2xl text-red-600 mb-4">Oops! Terjadi Kesalahan</p>
                <p className="text-lg text-gray-700 mb-6">{error}</p>
                <Link to="/" className="bg-foodie-500 hover:bg-foodie-600 text-white font-medium px-6 py-3 rounded-lg">
                    Kembali ke Halaman Utama
                </Link>
            </div>
        </div>
     );
  }

  if (!recipe) {
    // Ini bisa jadi kasus di mana resep tidak ditemukan setelah loading selesai tanpa error spesifik
    // Atau jika pengguna mencoba mengakses URL yang tidak valid secara langsung.
    // Anda bisa mengarahkan ke halaman 404 atau menampilkan pesan.
    return <Navigate to="/404" replace />; // Asumsi Anda punya halaman 404
  }

  return (
    <div className="min-h-screen bg-gray-100"> {/* Ganti background agar RecipeDetail lebih menonjol */}
      <Header />
      <main>
        <RecipeDetail recipe={recipe} />
      </main>
      {/* Anda bisa menambahkan Footer di sini jika ada */}
    </div>
  );
};

export default RecipePage;