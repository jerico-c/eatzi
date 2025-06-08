
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import IngredientInput from '../components/IngredientInput';
import CameraInput from '../components/CameraInput';
import FileInput from '../components/FileInput';
import { useRecipe } from '../context/RecipeContext';

const Index = () => {
  const { selectedIngredients, filteredRecipes } = useRecipe();

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-foodie-300 to-foodie-200 py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
                Ubah  <span className="text-foodie-600">Bahan Makananmu</span> Jadi Masakan Maknyus!!
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Temukan resep yang sesuai dengan bahan-bahan yang udah kamu punya. Cukup jepret foto atau masukin bahan-bahanmu sekarang.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#ingredients" 
                   className="bg-foodie-500 hover:bg-foodie-600 text-white font-medium px-6 py-3 rounded-lg text-center transition-colors shadow-lg hover:shadow-xl"
                  
                >
                  Cari Resepmu
                </a>
                <Link 
                  to="/about" 
                  className="border-2 border-foodie-500 text-foodie-600 hover:bg-foodie-100 font-medium px-6 py-3 rounded-lg text-center transition-colors"
                 
                >
                  Tentang Eatzi
                </Link>
                
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
                  <p className="text-foodie-600 font-medium">500+ Resep</p>
                  <p className="text-sm text-gray-600">Siap Dimasak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-6 left-0 w-full h-12 bg-foodie-100 transform rotate-1 opacity-50"></div>
        <div className="absolute -bottom-6 left-0 w-full h-12 bg-white transform -rotate-1 opacity-70"></div>
      </section>
      
      <div id="ingredients" className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Temuin Resep yang Sesuai</h2>
            <p className="text-lg text-gray-600">
              Masukin bahan-bahan yang kamu punya, ambil foto, atau unggah file buat dapetin resep yang cocok
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Kamu punya bahan makanan apa aja?</h2>
            <IngredientInput />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <CameraInput />
              <FileInput />
            </div>
            
            {selectedIngredients.length > 0 && (
              <div className="mt-6">
                <Link
                  to="/recipes"
                  className="block w-full bg-foodie-500 hover:bg-foodie-600 text-white py-3 px-4 rounded-lg text-center transition-colors"
                >
                  Find Recipes ({filteredRecipes.length})
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="bg-foodie-100 text-foodie-500 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Add Ingredients</h3>
              <p className="text-gray-600">Enter ingredients you have or take a photo</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="bg-foodie-100 text-foodie-500 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Browse Recipes</h3>
              <p className="text-gray-600">Find recipes that match your ingredients</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="bg-foodie-100 text-foodie-500 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Cook & Enjoy</h3>
              <p className="text-gray-600">Follow the recipe and enjoy your meal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
