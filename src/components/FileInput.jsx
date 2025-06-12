import React, { useRef, useState } from 'react';
import { FileImage, UploadCloud, Trash2 } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { useRecipe } from '../context/RecipeContext';

const FileInput = () => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState('');

  const { addIngredient, selectedIngredients } = useRecipe();


  const API_ENDPOINT = 'https://eatzi.snafcat.com/predict';
  const API_USERNAME = import.meta.env.VITE_API_USERNAME;
  const API_PASSWORD = import.meta.env.VITE_API_PASSWORD;

  const API_TOKEN = btoa(`${API_USERNAME}:${API_PASSWORD}`);

  const handleFileChangeAndUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
        sonnerToast.error("Format file tidak didukung", { description: "Silakan unggah file gambar (JPG, PNG, dll)."});
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
    }
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
        sonnerToast.error("Ukuran file terlalu besar", { description: `Maksimum ${maxSizeInMB} MB.`});
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    sonnerToast.info("Mengunggah dan menganalisis gambar...", { description: `Berkas: ${file.name}`});

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${API_TOKEN}`,
            'Accept': 'application/json'
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gagal mengunggah gambar: ${response.status} ${response.statusText}. Detail: ${errorData}`);
      }

      const result = await response.json();
      
      if (result && result.success && result.data && result.data.predicted_class) {
        const ingredientName = result.data.predicted_class;
        const isAlreadySelected = selectedIngredients.some(
          (selected) => selected.name.toLowerCase() === ingredientName.toLowerCase()
        );

        if (!isAlreadySelected) {
          addIngredient({
            id: `file-${Date.now()}-${ingredientName.toLowerCase().replace(/\s+/g, '-')}`,
            name: ingredientName,
          });
          sonnerToast.success(`Bahan "${ingredientName}" berhasil dideteksi dari file dan ditambahkan!`);
        } else {
          sonnerToast.info(`Bahan "${ingredientName}" sudah ada dalam daftar pilihan.`);
        }
      } else {
        const errorMessage = result.message || "Tidak ada bahan yang dikenali dari gambar yang diunggah.";
        sonnerToast.warning("Prediksi Gagal", { description: errorMessage });
      }

    } catch (error) {
      console.error("Error saat mengunggah file atau mengirim ke API:", error);
      sonnerToast.error("Terjadi kesalahan", { description: error.message || "Tidak dapat memproses file gambar." });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemovePreview = () => {
    setPreviewImage(null);
    setFileName('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChangeAndUpload}
        accept="image/*"
        className="hidden"
        aria-hidden="true"
      />
      {!previewImage ? (
        <button
            onClick={handleTriggerFileInput}
            disabled={isUploading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors 
                        border border-dashed border-gray-400 hover:border-foodie-500 
                        bg-gray-50 hover:bg-foodie-50 text-gray-600 hover:text-foodie-600
                        ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
            type="button"
        >
            <UploadCloud size={20} />
            <span>{isUploading ? 'Menganalisis...' : 'Unggah Foto Bahan'}</span>
        </button>
      ) : (
        <div className="mt-1 p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <p className="text-sm text-gray-600 mb-2 font-medium truncate" title={fileName}>
                Preview: {fileName}
            </p>
            <div className="relative w-full max-w-xs mx-auto h-auto bg-gray-100 rounded-md overflow-hidden shadow aspect-video mb-3">
                <img
                    src={previewImage}
                    alt={`Preview ${fileName}`}
                    className="w-full h-full object-contain"
                />
            </div>
            <button
                onClick={handleRemovePreview}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded-md transition-colors text-xs disabled:opacity-50"
                type="button"
            >
                <Trash2 size={14} />
                <span>Hapus & Ganti Gambar</span>
            </button>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1.5 text-center" id="file-input-description">
        Unggah foto bahan makanan untuk dideteksi otomatis.
      </p>
    </div>
  );
};

export default FileInput;