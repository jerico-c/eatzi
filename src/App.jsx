
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecipeProvider } from "./context/RecipeContext";
import Index from "./pages/Index";
import RecipesPage from "./pages/Recipes";
import RecipePage from "./pages/Recipe";
import CookingStories from "./pages/CookingStories";
import About from "./pages/About";
import NotFound from "./pages/NotFound";



const App = () => {
  return (
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RecipeProvider>
          <BrowserRouter>
          
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/resep/:recipeSlug" element={<RecipePage />} />
              <Route path="/stories" element={<CookingStories />} />
              <Route path="/about" element={<About />} />
              

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RecipeProvider>
      </TooltipProvider>
  );
};

export default App;