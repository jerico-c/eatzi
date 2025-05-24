
import React, { useState } from 'react';
import { ingredients } from '../utils/mockData';
import { useRecipe } from '../context/RecipeContext';
import { X, Search, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const IngredientInput = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [multiInput, setMultiInput] = useState('');
  const { selectedIngredients, addIngredient, removeIngredient } = useRecipe();

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedIngredients.some(selected => selected.id === ingredient.id)
  );

  const handleSelectIngredient = (ingredient) => {
    addIngredient(ingredient);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleAddMultipleIngredients = () => {
    if (!multiInput.trim()) return;

    // Split by commas or new lines
    const inputItems = multiInput.split(/[,\n]+/).map(item => item.trim()).filter(Boolean);
    
    let addedCount = 0;
    let notFoundItems = [];
    
    inputItems.forEach(itemName => {
      const matchedIngredient = ingredients.find(
        ing => ing.name.toLowerCase() === itemName.toLowerCase() &&
        !selectedIngredients.some(selected => selected.id === ing.id)
      );
      
      if (matchedIngredient) {
        addIngredient(matchedIngredient);
        addedCount++;
      } else {
        notFoundItems.push(itemName);
      }
    });
    
    if (addedCount > 0) {
      toast({
        title: `Added ${addedCount} ingredients`,
        description: addedCount === 1 ? "1 ingredient was added" : `${addedCount} ingredients were added`,
      });
      setMultiInput('');
      
      if (notFoundItems.length > 0) {
        toast({
          title: "Some ingredients not found",
          description: `Couldn't find: ${notFoundItems.join(", ")}`,
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "No ingredients added",
        description: "No matching ingredients found, or they're already selected",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>

        {showDropdown && searchQuery && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredIngredients.length > 0 ? (
              <ul className="py-1">
                {filteredIngredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="px-4 py-2 hover:bg-foodie-100 cursor-pointer flex items-center"
                    onClick={() => handleSelectIngredient(ingredient)}
                  >
                    {ingredient.image && (
                      <img src={ingredient.image} alt={ingredient.name} className="w-8 h-8 object-cover rounded-full mr-2" />
                    )}
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-2 text-gray-500">No ingredients found</p>
            )}
          </div>
        )}
      </div>

      {/* Multi-ingredient input */}
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="font-medium mb-2 text-gray-700">Add multiple ingredients</h3>
        <p className="text-sm text-gray-500 mb-3">
          Add several ingredients at once (separated by commas or new lines)
        </p>
        <div className="flex flex-col space-y-2">
          <Textarea
            value={multiInput}
            onChange={(e) => setMultiInput(e.target.value)}
            placeholder="tomato, onion, garlic..."
            className="min-h-[80px] w-full"
            rows={3}
          />
          <Button 
            onClick={handleAddMultipleIngredients}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            <span>Add Ingredients</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedIngredients.map(ingredient => (
          <div 
            key={ingredient.id}
            className="bg-foodie-200 text-foodie-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-fade-in"
          >
            <span>{ingredient.name}</span>
            <button 
              onClick={() => removeIngredient(ingredient.id)}
              className="text-foodie-500 hover:text-foodie-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;
