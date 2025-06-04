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
  // Jika menggunakan shadcn/ui toast:
  // const { toast } = useToast();

  const API_ENDPOINT = 'http://192.168.1.23:5001/klasifikasi_gambar';

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      sonnerToast.error("Invalid file type", { description: "Please select an image file" });
      return;
    }

    setIsUploading(true);
    setPreviewImage(null); 
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const imageDataUrl = e.target.result;
      setPreviewImage(imageDataUrl);
      
      sonnerToast.info("Analyzing image...", { description: "Looking for ingredients in your image..."});

      try {
        const imageBlob = await dataURLtoBlob(imageDataUrl);
        const formData = new FormData();
        formData.append('file', imageBlob, file.name || 'uploaded_image.jpg'); 

        sonnerToast.info("Sending image to API...");

        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          body: formData,
        });

        const responseText = await response.text();
        console.log("Raw API Response Status:", response.status); 
        console.log("Raw API Response Text:", responseText); 

        if (!response.ok) {
          let apiErrorMsg = responseText;
          try {
            const errorJson = JSON.parse(responseText);
            apiErrorMsg = errorJson.message || errorJson.error || responseText;
          } catch (parseError) { /* biarkan apiErrorMsg */ }
          throw new Error(`API Error (${response.status}): ${apiErrorMsg}`);
        }

        const classificationResult = JSON.parse(responseText);

        let topIngredientAdded = false;
        // Logika untuk hanya mengambil bahan teratas yang terdeteksi
        if (classificationResult && 
            classificationResult.hasil_klasifikasi && 
            Array.isArray(classificationResult.hasil_klasifikasi) && 
            classificationResult.hasil_klasifikasi.length > 0) {
              
          const topItem = classificationResult.hasil_klasifikasi[0]; // Ambil item pertama

          // Tambahkan bahan jika item pertama 'terdeteksi' adalah true
          if (topItem && topItem.terdeteksi === true && typeof topItem.bahan === 'string' && topItem.bahan.trim() !== '') {
            addIngredient({ 
              name: topItem.bahan, 
              id: `${Date.now()}-${topItem.bahan.replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 5)}`,
              confidence: topItem.confidence // Opsional
            });
            topIngredientAdded = true;
          }
        }
        
        if (topIngredientAdded) {
          sonnerToast.success("Top ingredient added!", { description: `API added the top detected ingredient to your list.`});
        } else {
          sonnerToast.warning("No top ingredient detected", { description: "The API didn't detect a top ingredient above the threshold or the list was empty."});
        }

      } catch (error) {
        console.error("Error processing image via API:", error);
        sonnerToast.error("Error processing image", { description: error.message || "Could not analyze the image using the API."});
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      sonnerToast.error("Error reading file", { description: "Could not read the image file."});
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
    
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
        accept="image/*"
        className="hidden"
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
