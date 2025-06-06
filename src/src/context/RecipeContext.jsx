// src/context/RecipeContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Hapus impor getFilteredRecipes dari mockData jika tidak digunakan lagi
// import { getFilteredRecipes } from '../utils/mockData'; 
import recommendationService from '../services/recommendationService'; // Impor layanan TF.js

const RecipeContext = createContext(undefined);

export const RecipeProvider = ({ children }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [dietaryPreferences, setDietaryPreferences] = useState(['all']); // Tetap ada jika masih digunakan untuk filter lain
  
  // State baru untuk menyimpan hasil dari recommendationService
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false); // Status loading untuk resep
  const [recipeError, setRecipeError] = useState(''); // Pesan error untuk resep

  // Inisialisasi recommendationService
  const [isServiceReady, setIsServiceReady] = useState(false);
  useEffect(() => {
    const initService = async () => {
      if (!recommendationService.isInitialized) {
        await recommendationService.init();
      }
      setIsServiceReady(recommendationService.isInitialized);
      if (!recommendationService.isInitialized) {
        console.error("RecipeContext: Gagal menginisialisasi recommendationService.");
        setRecipeError("Layanan rekomendasi utama tidak dapat dimuat.");
      }
    };
    initService();
  }, []);

  // Fungsi untuk mengambil resep dari recommendationService
  const fetchRecipesFromService = useCallback(async (ingredients) => {
    if (!isServiceReady) {
      // Jika layanan belum siap, jangan lakukan apa-apa atau set error
      if (ingredients.length > 0) { // Hanya set error jika ada bahan dipilih tapi layanan tidak siap
        setRecipeError("Layanan rekomendasi belum siap untuk memproses bahan Anda.");
      }
      setFilteredRecipes([]);
      return;
    }

    // Ubah array objek bahan menjadi array string nama bahan
    const ingredientNames = ingredients.map(ing => ing.name);

    if (ingredientNames.length === 0) {
      setFilteredRecipes([]);
      setRecipeError(''); // Kosongkan error jika tidak ada bahan
      return;
    }

    setIsLoadingRecipes(true);
    setRecipeError('');
    try {
      const recipes = await recommendationService.getRecommendations(ingredientNames, 20); // Ambil misal 20 resep
      setFilteredRecipes(recipes);
      if (recipes.length === 0) {
        setRecipeError("Tidak ada resep ditemukan untuk kombinasi bahan yang dipilih.");
      }
    } catch (error) {
      console.error("RecipeContext: Error mengambil resep dari recommendationService:", error);
      setFilteredRecipes([]);
      setRecipeError("Terjadi kesalahan saat mengambil rekomendasi resep.");
    } finally {
      setIsLoadingRecipes(false);
    }
  }, [isServiceReady]); // Dependencies

  // Panggil fetchRecipesFromService setiap kali selectedIngredients atau isServiceReady berubah
  useEffect(() => {
    if (isServiceReady) { // Hanya panggil jika service sudah siap
        fetchRecipesFromService(selectedIngredients);
    }
  }, [selectedIngredients, isServiceReady, fetchRecipesFromService]);


  const addIngredient = (ingredient) => {
    // Pastikan struktur ingredient yang ditambahkan konsisten (memiliki 'id' dan 'name')
    // Contoh: ingredient = { id: 'some-unique-id', name: 'Bawang Merah' }
    if (!selectedIngredients.some(i => i.name.toLowerCase() === ingredient.name.toLowerCase())) {
      // Generate ID jika tidak ada, atau pastikan ID unik
      const newIngredient = { 
        id: ingredient.id || `ing-${Date.now()}-${ingredient.name.toLowerCase().replace(/\s+/g, '-')}`, 
        name: ingredient.name,
        image: ingredient.image // Opsional
      };
      setSelectedIngredients(prev => [...prev, newIngredient]);
    }
  };
  
  const removeIngredient = (ingredientIdOrName) => {
    // Bisa menghapus berdasarkan ID atau nama sebagai fallback
    setSelectedIngredients(prev => prev.filter(i => i.id !== ingredientIdOrName && i.name !== ingredientIdOrName));
  };
  
  const togglePreference = (preference) => {
    // Logika preferensi diet bisa tetap ada, tapi getFilteredRecipes dari mockData sudah tidak dipakai.
    // Jika Anda ingin filter tambahan di atas hasil recommendationService, ini perlu diimplementasikan secara manual.
    if (preference === 'all') {
      setDietaryPreferences(['all']);
    } else {
      const updatedPreferences = dietaryPreferences.includes(preference)
        ? dietaryPreferences.filter(p => p !== preference)
        : [...dietaryPreferences.filter(p => p !== 'all'), preference];
      setDietaryPreferences(updatedPreferences.length ? updatedPreferences : ['all']);
    }
    // PENTING: Jika preferensi diet berubah, Anda mungkin perlu memfilter ulang `filteredRecipes`
    // atau memodifikasi `fetchRecipesFromService` jika recommendationService mendukung filter diet.
    // Untuk saat ini, perubahan preferensi diet tidak akan langsung memicu ulang pengambilan dari service.
  };
  
  // Fungsi like/dislike perlu disesuaikan jika ingin memodifikasi resep dari recommendationService
  // Ini lebih kompleks karena data resep sekarang dari CSV dan tidak ada di state lokal `recipes` yang mudah dimodifikasi.
  const likeRecipe = (recipeId) => {
    console.log("Like recipe (perlu implementasi jika data dari service):", recipeId);
    // Contoh: Anda mungkin perlu mengirim permintaan 'like' ke backend jika ada,
    // atau memodifikasi objek resep di 'filteredRecipes' (tapi ini hanya di sisi klien).
  };
  
  const dislikeRecipe = (recipeId) => {
    console.log("Dislike recipe (perlu implementasi jika data dari service):", recipeId);
  };
  
  // filteredRecipes sekarang di-set oleh fetchRecipesFromService
  // const filteredRecipesFromMockData = getFilteredRecipes( 
  //   selectedIngredients.map(i => i.name), // Kirim nama, bukan ID jika mockData berdasarkan nama
  //   dietaryPreferences
  // );
  
  const value = {
    selectedIngredients,
    addIngredient,
    removeIngredient,
    dietaryPreferences,
    togglePreference,
    filteredRecipes, // Ini sekarang berisi hasil dari recommendationService
    isLoadingRecipes, // Tambahkan status loading
    recipeError,      // Tambahkan pesan error
    isServiceReady,   // Tambahkan status kesiapan service
    likeRecipe,
    dislikeRecipe,
  };
  
  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};