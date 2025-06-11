
import React, { useState, useRef, useEffect } from 'react';
import { useRecipe } from '../context/RecipeContext'; 
import { X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from 'sonner'; 


const newMasterIngredientsList = [
  'Bawang Bombai', 'Bawang Merah', 'Bawang Putih', 'Brokoli', 'Cabai Hijau', 
  'Cabai Merah', 'Daging Sapi', 'Daging Unggas', 'Ikan', 'Jagung', 'Jahe', 
  'Jamur', 'Kacang Hijau', 'Kacang Merah', 'Kacang Panjang', 'Kacang Tanah', 
  'Kembang Kol', 'Kentang', 'Kikil', 'Kol', 'Labu Siam', 'Mie', 'Nasi', 
  'Petai', 'Sawi', 'Selada', 'Seledri', 'Telur Ayam', 'Telur Bebek', 
  'Tempe', 'Terong', 'Timun', 'Tomat', 'Usus', 'Wortel'
].map((name, index) => ({ 
  id: `master-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`, 
  name: name,
}));

const IngredientInput = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [multiInput, setMultiInput] = useState('');
  const { selectedIngredients, addIngredient, removeIngredient } = useRecipe();
  const dropdownRef = useRef(null);

  // Filter bahan dari daftar master baru
  const filteredMasterIngredients = newMasterIngredientsList.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedIngredients.some(selected => selected.name.toLowerCase() === ingredient.name.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const searchInput = document.getElementById('ingredientSearchInput'); 
        if (searchInput && searchInput.contains(event.target)) {
            return;
        }
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  const handleSelectIngredient = (ingredient) => {
    addIngredient({ 
        id: ingredient.id,
        name: ingredient.name,
        image: ingredient.image // Jika ada
    });
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleAddTypedIngredient = () => {
    const typedIngredientName = searchQuery.trim();
    if (typedIngredientName) {
      const isAlreadySelected = selectedIngredients.some(
        (selected) => selected.name.toLowerCase() === typedIngredientName.toLowerCase()
      );
      if (isAlreadySelected) {
        sonnerToast.info(`Bahan "${typedIngredientName}" sudah ada dalam daftar.`);
      } else {
        addIngredient({
          id: `typed-${Date.now()}-${typedIngredientName.toLowerCase().replace(/\s+/g, '-')}`,
          name: typedIngredientName,
          // image: opsional, bisa null atau placeholder default
        });
        sonnerToast.success(`Bahan "${typedIngredientName}" ditambahkan.`);
      }
      setSearchQuery('');
      setShowDropdown(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };
  
  const handleSearchInputKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      e.preventDefault(); // Mencegah submit form jika ada
      if (filteredMasterIngredients.length > 0) {
        handleSelectIngredient(filteredMasterIngredients[0]);
      } else {
        handleAddTypedIngredient();
      }
    }
  };


  return (
    <div className="w-full space-y-4">
      {/* Input Pencarian Bahan Tunggal */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Input
            id="ingredientSearchInput" // Tambahkan ID untuk referensi
            type="text"
            placeholder="Cari atau ketik bahan..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => searchQuery.trim() && setShowDropdown(true)}
            onKeyDown={handleSearchInputKeyDown} // Tambahkan event listener untuk Enter
            className="w-full pl-10 pr-16 py-2 text-sm" // Tambahkan padding kanan untuk tombol "Tambah"
          />
          
          {/* Tombol "Tambah" jika ada teks dan tidak ada hasil dropdown yang persis */}
          {searchQuery.trim() && !filteredMasterIngredients.some(ing => ing.name.toLowerCase() === searchQuery.trim().toLowerCase()) && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-foodie-600 hover:bg-foodie-100"
              onClick={handleAddTypedIngredient}
            >
              Tambah
            </Button>
          )}
        </div>

        {showDropdown && searchQuery.trim() && (
          <div className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
            {filteredMasterIngredients.length > 0 ? (
              <ul className="py-1">
                {filteredMasterIngredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="px-3 py-2 hover:bg-foodie-50 cursor-pointer flex items-center text-sm"
                    onClick={() => handleSelectIngredient(ingredient)}
                    onMouseDown={(e) => e.preventDefault()} // Mencegah blur pada input saat item diklik
                  >
                    
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-2 text-gray-500 text-sm">
                Bahan tidak ditemukan di daftar. Tekan Enter atau tombol "Tambah" untuk menambahkan "{searchQuery}".
              </p>
            )}
          </div>
        )}
      </div>

      {/* Daftar Bahan yang Dipilih */}
      {selectedIngredients.length > 0 && (
        <div>
            <h3 className="font-medium mb-2 text-gray-700 text-sm">Bahan yang Dipilih:</h3>
            <div className="flex flex-wrap gap-2">
            {selectedIngredients.map(ingredient => (
                <div 
                key={ingredient.id || ingredient.name} // Fallback ke nama jika ID tidak ada
                className="bg-foodie-100 text-foodie-700 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-sm shadow-sm"
                >
                <span>{ingredient.name}</span>
                <button 
                    onClick={() => removeIngredient(ingredient.id || ingredient.name)} // Fallback ke nama jika ID tidak ada
                    className="text-foodie-500 hover:text-foodie-700"
                    aria-label={`Hapus ${ingredient.name}`}
                >
                    <X size={14} />
                </button>
                </div>
            ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default IngredientInput;
