
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import recommendationService from '../services/recommendationService'; // Impor layanan TF.js

const RecipeContext = createContext(undefined);

export const RecipeProvider = ({ children }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [dietaryPreferences, setDietaryPreferences] = useState(['all']); 
  
  // State baru untuk menyimpan hasil dari recommendationService
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false); 
  const [recipeError, setRecipeError] = useState(''); 

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
    if (preference === 'all') {
      setDietaryPreferences(['all']);
    } else {
      const updatedPreferences = dietaryPreferences.includes(preference)
        ? dietaryPreferences.filter(p => p !== preference)
        : [...dietaryPreferences.filter(p => p !== 'all'), preference];
      setDietaryPreferences(updatedPreferences.length ? updatedPreferences : ['all']);
    }
  };
  
  
  const likeRecipe = (recipeId) => {
    console.log("Like recipe (perlu implementasi jika data dari service):", recipeId);
  };
  
  const dislikeRecipe = (recipeId) => {
    console.log("Dislike recipe (perlu implementasi jika data dari service):", recipeId);
  };

  
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