// src/pages/Index.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Tambahkan useCallback
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import IngredientInput from '../components/IngredientInput';
import CameraInput from '../components/CameraInput';
import FileInput from '../components/FileInput';
import { useRecipe } from '../context/RecipeContext'; // Ini akan menjadi sumber selectedIngredients

// --- Impor untuk Rekomendasi TF.js ---
import recommendationService from '../services/recommendationService';
import RecipeList from '../components/RecipeList';
import { Loader2, AlertTriangle, Sparkles } from 'lucide-react';

const Index = () => {
  // Ambil selectedIngredients dari RecipeContext
  // Ini adalah array objek: [{ id: '...', name: 'Bawang Merah' }, ...]
  const { selectedIngredients: contextSelectedIngredients, filteredRecipes: contextFilteredRecipes } = useRecipe();

  // --- State untuk hasil rekomendasi TF.js ---
  const [smartRecommendedRecipes, setSmartRecommendedRecipes] = useState([]);
  const [isSmartLoading, setIsSmartLoading] = useState(false);
  const [isTfServiceInitializing, setIsTfServiceInitializing] = useState(true);
  const [smartErrorMessage, setSmartErrorMessage] = useState('');

  // Inisialisasi Layanan Rekomendasi TF.js
  useEffect(() => {
    const initializeService = async () => {
      setIsTfServiceInitializing(true);
      setSmartErrorMessage('');
      if (!recommendationService.isInitialized) {
        await recommendationService.init();
      }
      if (!recommendationService.isInitialized) {
        setSmartErrorMessage("Gagal memuat mesin rekomendasi cerdas (TF.js). Fitur ini mungkin tidak tersedia.");
        console.error("Layanan Rekomendasi TF.js: Gagal menginisialisasi.");
      }
      setIsTfServiceInitializing(false);
    };
    initializeService();
  }, []);

  // Fungsi untuk mendapatkan rekomendasi TF.js berdasarkan bahan dari context
  const fetchSmartRecommendations = useCallback(async (ingredientsFromContext) => {
    if (isTfServiceInitializing || !recommendationService.isInitialized) {
      // Jika service belum siap, jangan lakukan apa-apa atau beri pesan
      if (!isTfServiceInitializing) { // Hanya tampilkan error jika inisialisasi selesai tapi gagal
          setSmartErrorMessage("Layanan rekomendasi cerdas belum siap.");
      }
      return;
    }

    // Ubah array objek bahan dari context menjadi array string nama bahan
    const ingredientNames = ingredientsFromContext.map(ing => ing.name);

    if (ingredientNames.length === 0) {
      setSmartRecommendedRecipes([]);
      setSmartErrorMessage(''); // Kosongkan pesan error jika tidak ada bahan dipilih
      return;
    }

    setIsSmartLoading(true);
    setSmartErrorMessage('');
    setSmartRecommendedRecipes([]);
    try {
      const recipes = await recommendationService.getRecommendations(ingredientNames, 6); // Ambil 6 resep
      setSmartRecommendedRecipes(recipes);
      if (recipes.length === 0) {
        setSmartErrorMessage('Tidak ada rekomendasi cerdas ditemukan untuk kombinasi bahan ini.');
      }
    } catch (error) {
      console.error("Layanan Rekomendasi TF.js: Error mendapatkan rekomendasi:", error);
      setSmartErrorMessage('Terjadi kesalahan saat mencari rekomendasi cerdas.');
    }
    setIsSmartLoading(false);
  }, [isTfServiceInitializing]); // Dependencies

  // Panggil fetchSmartRecommendations setiap kali contextSelectedIngredients berubah
  useEffect(() => {
    if (!isTfServiceInitializing && recommendationService.isInitialized) {
        // Hanya panggil jika service sudah siap
        fetchSmartRecommendations(contextSelectedIngredients);
    } else if (!isTfServiceInitializing && !recommendationService.isInitialized) {
        // Jika inisialisasi selesai tapi gagal, dan ada bahan dipilih, tampilkan pesan
        if (contextSelectedIngredients.length > 0) {
            setSmartErrorMessage("Layanan rekomendasi cerdas tidak aktif. Tidak dapat memproses bahan.");
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextSelectedIngredients, isTfServiceInitializing, recommendationService.isInitialized]);
  // Tidak perlu fetchSmartRecommendations di dependencies karena sudah di-memoize useCallback


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section (Struktur dari Anda) */}
      <section className="relative bg-gradient-to-r from-foodie-300 to-foodie-200 py-16 overflow-hidden">
        {/* ... kode hero section Anda ... */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
                Transform Your <span className="text-foodie-600">Pantry</span> Into Delicious Meals
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Discover recipes tailored to the ingredients you already have. Simply snap a photo or select your ingredients to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/recipes" 
                  className="bg-foodie-500 hover:bg-foodie-600 text-white font-medium px-6 py-3 rounded-lg text-center transition-colors shadow-lg hover:shadow-xl"
                >
                  Jelajahi Semua Resep
                </Link>
                <a 
                  href="#ingredients" 
                  className="border-2 border-foodie-500 text-foodie-600 hover:bg-foodie-100 font-medium px-6 py-3 rounded-lg text-center transition-colors"
                >
                  Input Bahan Saya
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="bg-white p-6 rounded-xl shadow-lg transform rotate-1 hover:rotate-0 transition-transform">
                  <img 
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                    alt="Delicious Food" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-foodie-100 p-4 rounded-lg shadow-md hidden md:block">
                  <p className="text-foodie-600 font-medium">200+ Recipes</p>
                  <p className="text-sm text-gray-600">Ready to Cook</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 left-0 w-full h-12 bg-foodie-100 transform rotate-1 opacity-50"></div>
        <div className="absolute -bottom-6 left-0 w-full h-12 bg-white transform -rotate-1 opacity-70"></div>
      </section>
      
      <div className="container mx-auto px-4 py-12">
        {/* Bagian Input Bahan Metode Standar (dari struktur Anda) */}
        <div id="ingredients" className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Input Bahan Anda</h2>
              <p className="text-lg text-gray-600">
                Masukkan bahan, ambil foto, atau unggah daftar bahan.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Bahan apa yang Anda miliki?</h3>
              {/* IngredientInput sekarang akan memicu rekomendasi cerdas di bawahnya */}
              <IngredientInput /> 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CameraInput />
                <FileInput />
              </div>
              
              {/* Tombol ini tetap mengarah ke /recipes untuk hasil dari mockData (RecipeContext standar) */}
              {contextSelectedIngredients.length > 0 && (
                <div className="mt-6">
                  <Link
                    to="/recipes"
                    className="block w-full bg-foodie-500 hover:bg-foodie-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors shadow-md"
                  >
                    Lihat Hasil Pencarian Standar ({contextFilteredRecipes.length})
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Bagian untuk Menampilkan Rekomendasi Cerdas (TF.js) --- */}
        {/* Hanya tampilkan jika service sudah inisialisasi (berhasil atau gagal) */}
        {!isTfServiceInitializing && (
            <div id="smart-recommendation-results" className="mb-12">
            <div className="max-w-4xl mx-auto">
                {/* Judul hanya jika ada bahan dipilih atau sedang loading/ada error terkait bahan */}
                {(contextSelectedIngredients.length > 0 || isSmartLoading || (smartErrorMessage && smartRecommendedRecipes.length === 0)) && recommendationService.isInitialized && (
                    <div className="text-center mb-8 pt-8 border-t border-gray-200">
                        <h2 className="text-3xl font-bold mb-2 text-gray-800 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 mr-3 text-foodie-500" />
                        Rekomendasi Cerdas (Berdasarkan Input Anda)
                        </h2>
                    </div>
                )}

                {/* Loading state untuk TF.js service initialization */}
                {/* (Sudah dihandle di atas, di sini fokus ke hasil) */}

                {/* Pesan error jika service TF.js gagal total */}
                {!recommendationService.isInitialized && smartErrorMessage && (
                    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-md text-center" role="alert">
                        <AlertTriangle className="h-6 w-6 inline mr-2" /> {smartErrorMessage}
                    </div>
                )}

                {/* Hanya tampilkan jika service TF.js sudah berhasil inisialisasi */}
                {recommendationService.isInitialized && (
                <>
                    {isSmartLoading && (
                    <div className="text-center py-10 mt-6">
                        <Loader2 className="h-10 w-10 animate-spin text-foodie-500 mx-auto mb-3" />
                        <p className="text-lg text-gray-600">Mencari rekomendasi cerdas...</p>
                    </div>
                    )}
                    
                    {!isSmartLoading && smartErrorMessage && smartRecommendedRecipes.length === 0 && contextSelectedIngredients.length > 0 && (
                    <div className="text-center py-6 mt-6 bg-yellow-50 border border-yellow-300 text-yellow-700 p-4 rounded-md shadow">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <p className="font-semibold">{smartErrorMessage}</p>
                    </div>
                    )}

                    {!isSmartLoading && smartRecommendedRecipes.length > 0 && (
                    <div className="mt-2"> {/* Margin atas disesuaikan */}
                        <RecipeList recipes={smartRecommendedRecipes} />
                    </div>
                    )}
                    {/* Tidak ada pesan jika tidak ada bahan dipilih dan tidak loading/error */}
                </>
                )}
            </div>
            </div>
        )}


        {/* Bagian "How It Works" (dari struktur Anda) */}
        {/* ... kode how it works section Anda ... */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="bg-foodie-100 text-foodie-500 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-700">Pilih Bahan</h3>
              <p className="text-sm text-gray-600">Masukkan bahan yang Anda miliki atau pilih dari daftar populer.</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="bg-foodie-100 text-foodie-500 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-700">Temukan Resep</h3>
              <p className="text-sm text-gray-600">Lihat resep yang cocok dengan bahan-bahan Anda.</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="bg-foodie-100 text-foodie-500 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-700">Masak & Nikmati</h3>
              <p className="text-sm text-gray-600">Ikuti langkahnya dan nikmati hidangan lezat Anda!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;