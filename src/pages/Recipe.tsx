
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { recipes } from '../utils/mockData';
import RecipeDetail from '../components/RecipeDetail';
import { ArrowLeft } from 'lucide-react';

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState(recipes.find(r => r.id === id));
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Update recipe if ID changes
    setRecipe(recipes.find(r => r.id === id));
  }, [id]);
  
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Recipe not found</h1>
          <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
          <Link to="/recipes" className="text-foodie-500 hover:text-foodie-600 flex items-center justify-center gap-2">
            <ArrowLeft size={18} />
            <span>Back to recipes</span>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/recipes" className="text-foodie-500 hover:text-foodie-600 flex items-center gap-2 mb-2">
            <ArrowLeft size={18} />
            <span>Back to recipes</span>
          </Link>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <RecipeDetail recipe={recipe} />
        </div>
      </div>
    </div>
  );
};

export default Recipe;
