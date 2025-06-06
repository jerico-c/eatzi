// src/App.tsx
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Hapus jika tidak digunakan
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecipeProvider } from "./context/RecipeContext"; // Pastikan path benar
import Index from "./pages/Index";       // Pastikan ini mengarah ke Index.tsx atau .jsx yang benar
import RecipesPage from "./pages/Recipes";   // Mengganti nama variabel impor agar lebih jelas (jika nama file Recipes.tsx)
import RecipePage from "./pages/Recipe";   // Mengganti nama variabel impor agar lebih jelas (jika nama file Recipe.tsx)
import About from "./pages/About";       // Pastikan path benar
import NotFound from "./pages/NotFound"; // Pastikan path benar

// Create a client (Hapus jika tidak menggunakan React Query)
// const queryClient = new QueryClient();

const App = () => {
  return (
    // <QueryClientProvider client={queryClient}> {/* Hapus jika tidak menggunakan React Query */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RecipeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/resep/:recipeSlug" element={<RecipePage />} /> 
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RecipeProvider>
      </TooltipProvider>
    // </QueryClientProvider> {/* Hapus jika tidak menggunakan React Query */}
  );
};

export default App;