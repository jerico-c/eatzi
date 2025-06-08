// src/components/IngredientInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useRecipe } from '../context/RecipeContext'; // Pastikan path ini benar
import { X, Search, Plus, AlertCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from 'sonner'; // Menggunakan sonner untuk notifikasi

// Daftar bahan baru yang Anda berikan
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
  // Anda bisa menambahkan path gambar default jika ada
  // image: `/images/ingredients/${name.toLowerCase().replace(/\s+/g, '-')}.jpg` 
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

  // Menangani klik di luar dropdown untuk menutupnya
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Cek juga apakah klik terjadi pada input pencarian untuk mencegah penutupan prematur
        const searchInput = document.getElementById('ingredientSearchInput'); // Beri ID pada input
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
    addIngredient({ // Pastikan mengirim objek dengan struktur yang diharapkan oleh addIngredient
        id: ingredient.id,
        name: ingredient.name,
        image: ingredient.image // Jika ada
    });
    setSearchQuery('');
    setShowDropdown(false);
  };

  // Fungsi untuk menambahkan bahan yang diketik jika tidak ada di dropdown
  // dan pengguna menekan Enter atau tombol khusus
  const handleAddTypedIngredient = () => {
    const typedIngredientName = searchQuery.trim();
    if (typedIngredientName) {
      // Cek apakah sudah ada di selectedIngredients (case-insensitive)
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
      setSearchQuery(''); // Kosongkan input setelah ditambahkan
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
      // Jika ada hasil di dropdown, pilih yang pertama. Jika tidak, tambahkan yang diketik.
      if (filteredMasterIngredients.length > 0) {
        handleSelectIngredient(filteredMasterIngredients[0]);
      } else {
        handleAddTypedIngredient();
      }
    }
  };


  const handleAddMultipleIngredients = () => {
    if (!multiInput.trim()) return;

    const inputItems = multiInput.split(/[,\n]+/).map(item => item.trim().toLowerCase()).filter(Boolean);
    
    let addedCount = 0;
    let notFoundInMasterList = []; // Untuk bahan yang tidak ada di daftar master

    inputItems.forEach(itemName => {
      if (itemName) {
        const isAlreadySelected = selectedIngredients.some(
          (selected) => selected.name.toLowerCase() === itemName
        );
        if (isAlreadySelected) {
          sonnerToast.info(`Bahan "${itemName}" sudah ada dalam daftar.`);
          return; // Lanjut ke item berikutnya
        }

        const matchedInMaster = newMasterIngredientsList.find(
          ing => ing.name.toLowerCase() === itemName
        );
        
        if (matchedInMaster) {
          addIngredient({
            id: matchedInMaster.id,
            name: matchedInMaster.name,
            image: matchedInMaster.image
          });
          addedCount++;
        } else {
          // Jika tidak ada di daftar master, tetap tambahkan sebagai bahan kustom
          addIngredient({
            name: itemName.charAt(0).toUpperCase() + itemName.slice(1), // Kapitalisasi huruf pertama
            id: `multi-${Date.now()}-${itemName.replace(/\s+/g, '-')}`
          });
          addedCount++;
          notFoundInMasterList.push(itemName); // Catat sebagai tidak ditemukan di master list
        }
      }
    });
    
    if (addedCount > 0) {
      sonnerToast.success(`${addedCount} bahan berhasil ditambahkan.`);
      setMultiInput(''); // Kosongkan textarea
      
      if (notFoundInMasterList.length > 0) {
        // Ini bukan error, hanya info bahwa beberapa bahan adalah kustom
        // sonnerToast.info("Beberapa bahan ditambahkan sebagai kustom", {
        //   description: `Bahan berikut tidak ada di daftar utama: ${notFoundInMasterList.join(", ")}`,
        // });
      }
    } else if (!inputItems.some(itemName => selectedIngredients.some(sel => sel.name.toLowerCase() === itemName))) {
      // Hanya tampilkan jika tidak ada yang ditambahkan DAN tidak ada yang sudah terpilih
      sonnerToast.warning("Tidak ada bahan baru yang ditambahkan.", {
        description: "Pastikan format input benar atau bahan belum ada di daftar.",
      });
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                    {/* Anda bisa menambahkan gambar jika ada di newMasterIngredientsList */}
                    {/* {ingredient.image && (
                      <img src={ingredient.image} alt={ingredient.name} className="w-6 h-6 object-cover rounded-full mr-2" />
                    )} */}
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
