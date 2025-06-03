import React, { useRef, useState } from 'react';
import { FileImage } from 'lucide-react';
import { toast as sonnerToast } from 'sonner'; 
import { useRecipe } from '../context/RecipeContext';

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
  // Jika menggunakan hook useToast dari shadcn/ui
  // const { toast } = useToast();

  const API_ENDPOINT = 'http://192.168.1.23:5001/klasifikasi_gambar';

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      sonnerToast.error("Invalid file type", { description: "Please select an image file" });
      // Jika shadcn/ui: toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const imageDataUrl = e.target.result; // Ini adalah data URL base64
      setPreviewImage(imageDataUrl);
      
      sonnerToast.info("Analyzing image...", { description: "Looking for ingredients in your image..."});
      // Jika shadcn/ui: toast({ title: "Analyzing image", description: "Looking for ingredients in your image..." });

      try {
        // 1. Convert data URL to Blob
        const imageBlob = await dataURLtoBlob(imageDataUrl);

        // 2. Create FormData and append the image
        const formData = new FormData();
        // Ganti 'file' dengan nama field yang diharapkan oleh API Anda
        // Nama file 'uploaded_image.jpg' adalah opsional tapi praktik yang baik
        formData.append('file', imageBlob, file.name || 'uploaded_image.jpg'); 

        sonnerToast.info("Sending image to API...");
        // Jika shadcn/ui: toast({ title: "Sending image to API...", description: "Please wait." });

        // 3. POST to your API
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          body: formData,
          // 'Content-Type': 'multipart/form-data' akan diatur otomatis oleh browser untuk FormData
        });

        if (!response.ok) {
          const errorText = await response.text();
          // Coba parse errorText sebagai JSON jika API mungkin mengirim detail error dalam JSON
          let apiErrorMsg = errorText;
          try {
            const errorJson = JSON.parse(errorText);
            apiErrorMsg = errorJson.message || errorJson.error || errorText;
          } catch (parseError) {
            // Biarkan apiErrorMsg sebagai errorText jika bukan JSON
          }
          throw new Error(`API Error (${response.status}): ${apiErrorMsg}`);
        }

        const classificationResult = await response.json(); // Asumsi API mengembalikan JSON

        // 4. Process API response
        let ingredientsFound = 0;
        if (classificationResult && classificationResult.ingredients && Array.isArray(classificationResult.ingredients)) {
          classificationResult.ingredients.forEach(ingredientName => {
            if (typeof ingredientName === 'string' && ingredientName.trim() !== '') {
              addIngredient({ name: ingredientName, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
              ingredientsFound++;
            }
          });
        } else if (Array.isArray(classificationResult)) { // Jika API langsung mengembalikan array string nama ingredient
          classificationResult.forEach(ingredientName => {
             if (typeof ingredientName === 'string' && ingredientName.trim() !== '') {
               addIngredient({ name: ingredientName, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
               ingredientsFound++;
             }
          });
        }
        
        if (ingredientsFound === 0) {
          sonnerToast.warning("No ingredients found", { description: "The API didn't recognize any ingredients in the image."});
          // Jika shadcn/ui: toast({ title: "No ingredients found", description: "The API didn't recognize any ingredients in the image.", variant: "default" }); // atau warning jika ada
        } else {
          sonnerToast.success("Analysis complete!", { description: `API found ${ingredientsFound} ingredients in your image.`});
          // Jika shadcn/ui: toast({ title: "Analysis complete", description: `API found ${ingredientsFound} ingredients in your image.` });
        }

      } catch (error) {
        console.error("Error processing image via API:", error);
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
    
    if (event.target) {
        event.target.value = ""; // Reset input file
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
        accept="image/*"
        className="hidden"
        aria-hidden="true" // Tambahkan untuk aksesibilitas karena dikontrol tombol lain
      />
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-200 transition-colors ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
        type="button" // Eksplisitkan type button
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
