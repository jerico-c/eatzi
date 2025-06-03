import React, { useRef, useState } from 'react';
import { FileImage } from 'lucide-react';
// Ganti dengan implementasi toast yang Anda gunakan.
// Jika menggunakan sonner:
import { toast as sonnerToast } from 'sonner';
// Jika menggunakan shadcn/ui toast, Anda perlu memanggil hook useToast() di dalam komponen:
// import { useToast } from '@/components/ui/use-toast'; // Contoh path

// Pastikan path ke RecipeContext sudah benar
import { useRecipe } from '../context/RecipeContext';

// Helper function to convert data URL to Blob
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
  const [previewImage, setPreviewImage] = useState(null);
  const { addIngredient } = useRecipe();
  // Jika menggunakan shadcn/ui toast:
  // const { toast } = useToast();

  const API_ENDPOINT = 'http://192.168.1.23:5001/klasifikasi_gambar';

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      // Menggunakan sonnerToast sebagai contoh
      sonnerToast.error("Invalid file type", { description: "Please select an image file" });
      // Jika shadcn/ui: toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setPreviewImage(null); // Reset preview sebelum memuat yang baru
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const imageDataUrl = e.target.result;
      setPreviewImage(imageDataUrl);
      
      sonnerToast.info("Analyzing image...", { description: "Looking for ingredients in your image..."});
      // Jika shadcn/ui: toast({ title: "Analyzing image", description: "Looking for ingredients in your image..." });

      try {
        const imageBlob = await dataURLtoBlob(imageDataUrl);
        const formData = new FormData();
        formData.append('file', imageBlob, file.name || 'uploaded_image.jpg'); 

        sonnerToast.info("Sending image to API...");
        // Jika shadcn/ui: toast({ title: "Sending image to API...", description: "Please wait." });

        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          body: formData,
        });

        const responseText = await response.text();
        console.log("Raw API Response Status:", response.status); // Untuk debugging
        console.log("Raw API Response Text:", responseText); // Untuk debugging

        if (!response.ok) {
          let apiErrorMsg = responseText;
          try {
            const errorJson = JSON.parse(responseText);
            apiErrorMsg = errorJson.message || errorJson.error || responseText;
          } catch (parseError) { 
            // Biarkan apiErrorMsg sebagai responseText jika bukan JSON
          }
          throw new Error(`API Error (${response.status}): ${apiErrorMsg}`);
        }

        const classificationResult = JSON.parse(responseText);

        let ingredientsFound = 0;
        if (classificationResult && classificationResult.bahan_terdeteksi && Array.isArray(classificationResult.bahan_terdeteksi)) {
          classificationResult.bahan_terdeteksi.forEach(item => {
            if (item && typeof item.bahan === 'string' && item.bahan.trim() !== '') {
              addIngredient({ 
                name: item.bahan, 
                // confidence: item.confidence, // Anda bisa tambahkan confidence jika perlu
                id: `${Date.now()}-${item.bahan.replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 5)}` 
              });
              ingredientsFound++;
            }
          });
        }
        
        if (ingredientsFound === 0) {
          sonnerToast.warning("No ingredients found", { description: "The API didn't recognize any ingredients in the image."});
          // Jika shadcn/ui: toast({ title: "No ingredients found", description: "The API didn't recognize any ingredients in the image."});
        } else {
          sonnerToast.success("Analysis complete!", { description: `API found ${ingredientsFound} ingredients in your image.`});
          // Jika shadcn/ui: toast({ title: "Analysis complete", description: `API found ${ingredientsFound} ingredients in your image.` });
        }

      } catch (error) {
        console.error("Error processing image via API:", error); // Log error lebih detail
        sonnerToast.error("Error processing image", { description: error.message || "Could not analyze the image using the API."});
        // Jika shadcn/ui: toast({ title: "Error processing image", description: error.message || "Could not analyze the image using the API.", variant: "destructive" });
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      sonnerToast.error("Error reading file", { description: "Could not read the image file."});
      // Jika shadcn/ui: toast({ title: "Error reading file", description: "Could not read the image file", variant: "destructive" });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
    
    // Reset input file agar event onChange bisa terpicu lagi untuk file yang sama
    if (event.target) {
        event.target.value = null; 
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  return (
    <div className="mt-4">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        accept="image/*" // Hanya menerima file gambar
        className="hidden" // Sembunyikan input file asli
        aria-hidden="true"
      />
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg transition-colors ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
        type="button"
      >
        <FileImage size={18} />
        <span>{isUploading ? 'Analyzing...' : 'Upload ingredient photo'}</span>
      </button>
      <p className="text-xs text-gray-500 mt-1" id="file-input-description">
        Upload a photo of ingredients to scan
      </p>
      
      {previewImage && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">Uploaded image:</p>
          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={previewImage}
              alt="Uploaded ingredients"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInput;
