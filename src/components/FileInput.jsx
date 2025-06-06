// src/components/FileInput.jsx
import React, { useRef, useState } from 'react';
import { FileImage, UploadCloud, Trash2 } from 'lucide-react'; // Tambahkan ikon
import { toast as sonnerToast } from 'sonner';
import { useRecipe } from '../context/RecipeContext'; // Pastikan path ini benar

// Fungsi dataURLtoBlob bisa jadi sudah ada di CameraInput atau utils
// Jika belum, tambahkan di sini atau impor dari utils.
async function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  if (arr.length < 2) {
    throw new Error('Invalid data URL');
  }
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || mimeMatch.length < 2) {
    throw new Error('Could not determine MIME type from data URL');
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

const FileInput = () => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // URL Data untuk preview
  const [fileName, setFileName] = useState('');

  const { addIngredient, selectedIngredients } = useRecipe();

  // Endpoint API Anda (pastikan ini benar)
  const API_ENDPOINT = 'http://192.168.1.23:5001/klasifikasi_gambar';

  const handleFileChangeAndUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Validasi tipe file (opsional tapi direkomendasikan)
    if (!file.type.startsWith('image/')) {
        sonnerToast.error("Format file tidak didukung", { description: "Silakan unggah file gambar (JPG, PNG, dll)."});
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input file
        return;
    }
    // Validasi ukuran file (opsional)
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
        sonnerToast.error("Ukuran file terlalu besar", { description: `Maksimum ${maxSizeInMB} MB.`});
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
    }


    setFileName(file.name);
    // Buat preview menggunakan FileReader
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
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gagal mengunggah gambar: ${response.status} ${response.statusText}. Detail: ${errorData}`);
      }

      const result = await response.json();
      
      // Proses hasil dari API
      if (result && result.bahan_terdeteksi && result.bahan_terdeteksi.length > 0) {
        let ingredientsAddedCount = 0;
        result.bahan_terdeteksi.forEach(detected => {
          const ingredientName = detected.bahan;
          const isAlreadySelected = selectedIngredients.some(
            (selected) => selected.name.toLowerCase() === ingredientName.toLowerCase()
          );

          if (!isAlreadySelected) {
            addIngredient({
              id: `file-${Date.now()}-${ingredientName.toLowerCase().replace(/\s+/g, '-')}`,
              name: ingredientName,
            });
            ingredientsAddedCount++;
          } else {
            sonnerToast.info(`Bahan "${ingredientName}" sudah ada dalam daftar pilihan.`);
          }
        });

        if (ingredientsAddedCount > 0) {
          sonnerToast.success(`${ingredientsAddedCount} bahan berhasil dideteksi dari file dan ditambahkan!`);
        } else if (result.bahan_terdeteksi.length > 0) {
            sonnerToast.info("Semua bahan yang terdeteksi dari file sudah ada dalam daftar pilihan Anda.");
        } else {
            sonnerToast.warning("Tidak ada bahan yang dikenali dari gambar yang diunggah.");
        }
      } else {
        sonnerToast.warning("Tidak ada bahan yang dikenali dari gambar yang diunggah.");
      }

    } catch (error) {
      console.error("Error saat mengunggah file atau mengirim ke API:", error);
      sonnerToast.error("Terjadi kesalahan", { description: error.message || "Tidak dapat memproses file gambar." });
      // Reset preview jika error setelah gambar dipilih
      // setPreviewImage(null); 
      // setFileName('');
    } finally {
      setIsUploading(false);
      // Reset input file agar file yang sama bisa diunggah lagi jika perlu
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
        fileInputRef.current.value = ''; // Reset input file
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChangeAndUpload}
        accept="image/*" // Hanya terima file gambar
        className="hidden" // Sembunyikan input file asli
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