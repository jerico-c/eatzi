
import React from 'react';
import { useRecipe } from '../context/RecipeContext';
import { Check } from 'lucide-react';

const dietaryOptions = [
  { id: 'all', label: 'All Recipes' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'nut-free', label: 'Nut Free' },
];

const DietaryFilter = () => {
  const { dietaryPreferences, togglePreference } = useRecipe();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Dietary Preferences</h2>
      <div className="flex flex-wrap gap-2">
        {dietaryOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => togglePreference(option.id)}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
              dietaryPreferences.includes(option.id)
                ? 'bg-foodie-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {dietaryPreferences.includes(option.id) && <Check size={14} />}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DietaryFilter;
