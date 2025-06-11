import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, ThumbsUp, ListChecks, Soup, BookOpen, AlertTriangle, Zap, ChefHat } from 'lucide-react';

const RecipeDetail = ({ recipe }) => {
  const navigate = useNavigate();

  if (!recipe || typeof recipe !== 'object' || Object.keys(recipe).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Detail Resep Tidak Tersedia</h2>
        <p className="text-gray-600">Maaf, kami tidak dapat memuat detail untuk resep ini.</p>
        <button 
            onClick={() => navigate(-1)} 
            className="mt-6 bg-foodie-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-foodie-600 transition-colors flex items-center mx-auto"
        >
            <ArrowLeft size={18} className="mr-2" />
            Kembali
        </button>
      </div>
    );
  }

  // --- Ekstraksi Data dari Objek Recipe ---
  const title = recipe.Title || "Resep Tanpa Judul";
  const ingredientsString = recipe.Ingredients || "";
  const servings = recipe.Servings || 'N/A';
  const difficulty = recipe.Difficulty || 'N/A';
  const caloriesRaw = recipe.Kalori;
  const prepTime = recipe.Prep_Time || 'N/A';
  const cookingTime = recipe.Cooking_Time || 'N/A';
  const loves = recipe.Loves !== undefined ? recipe.Loves : 'N/A';
  const stepsRaw = recipe.Steps || recipe.strInstructions || "";
  const mainIngredientsString = recipe.Cleaned_Ingredients || "";

  let caloriesDisplay = 'N/A';
  let showCalories = false;
  if (typeof caloriesRaw === 'number' && caloriesRaw > 0) {
    caloriesDisplay = `${Math.round(caloriesRaw)} Kalori`;
    showCalories = true;
  }

  const ingredientsList = ingredientsString.split('\n').map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
  const stepsList = stepsRaw.split('\n').map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
  const mainIngredientsList = mainIngredientsString.split(',').map(item => item.trim()).filter(Boolean);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 md:py-8">
      <div className="mb-4">
          <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors py-2 px-3 rounded-lg hover:bg-gray-100"
          >
              <ArrowLeft size={20} />
              Kembali ke Daftar Resep
          </button>
      </div>

      <article className="bg-white rounded-xl shadow-xl">
        
        <div className="p-6 md:p-10">
            <div className="flex flex-col items-center">
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                    <ChefHat size={52} className="text-green-600" strokeWidth={1.5} />
                </div>
                <h1 className="w-full text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                    {title}
                </h1>
            </div>


            <div className="flex justify-center items-center gap-4 sm:gap-6 my-6 text-gray-800">
                <div className="flex items-center gap-2">
                    <ThumbsUp size={20} className="text-green-500"/>
                    <span className="font-bold text-lg">{loves}</span>
                    <span className="text-gray-500 text-sm">Suka</span>
                </div>
                {showCalories && (
                    <>
                      <div className="h-6 w-px bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                          <Zap size={20} className="text-yellow-500"/>
                          <span className="font-bold text-lg">{caloriesDisplay}</span>
                      </div>
                    </>
                )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              {prepTime !== 'N/A' && <div className="flex items-center"><Clock size={16} className="mr-1.5"/><span>Persiapan: {prepTime}</span></div>}
              {cookingTime !== 'N/A' && <div className="flex items-center"><Clock size={16} className="mr-1.5"/><span>Memasak: {cookingTime}</span></div>}
              {servings !== 'N/A' && <div className="flex items-center"><User size={16} className="mr-1.5"/><span>Porsi: {servings}</span></div>}
              {difficulty !== 'N/A' && <div className="flex items-center"><Soup size={16} className="mr-1.5"/><span>Kesulitan: {difficulty}</span></div>}
            </div>
        </div>

        <div className="px-6 md:px-8 pb-8 border-t border-gray-200 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-10 pt-6">
            
            <div className="lg:col-span-2 mb-8 lg:mb-0">
              {mainIngredientsList.length > 0 && (
                  <section className="mb-8">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                          <ListChecks size={22} className="mr-3 text-indigo-600" />
                          Bahan Utama
                      </h2>
                      <div className="flex flex-wrap gap-2">
                          {mainIngredientsList.map((ingredient, index) => (
                              <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {ingredient}
                              </span>
                          ))}
                      </div>
                  </section>
              )}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <BookOpen size={22} className="mr-3 text-green-600" />
                  Bahan-Bahan
                </h2>
                {ingredientsList.length > 0 ? (
                  <div className="space-y-3 text-gray-700">
                    {ingredientsList.map((ingredient, index) => (
                      <div key={index} className="flex">
                        <span className="font-semibold mr-2">{index + 1}.</span>
                        <p className="leading-relaxed">{ingredient}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 italic">Bahan tidak tersedia.</p>}
              </section>
            </div>

            <div className="lg:col-span-3 lg:border-l lg:pl-10 border-gray-200">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <ChefHat size={22} className="mr-3 text-blue-600" />
                  Langkah-Langkah
                </h2>
                {stepsList.length > 0 ? (
                  <div className="space-y-4 text-gray-700">
                    {stepsList.map((step, index) => (
                      <div key={index} className="flex">
                        <span className="font-semibold mr-3">{index + 1}.</span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 italic">Langkah pembuatan tidak tersedia.</p>}
              </section>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default RecipeDetail;