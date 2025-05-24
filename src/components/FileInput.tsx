
import React, { useRef, useState } from 'react';
import { FileImage } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useRecipe } from '../context/RecipeContext';
import { recognizeIngredientsFromImage } from '../utils/aiRecognition';

const FileInput: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { addIngredient } = useRecipe();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Create a preview of the image
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const imageData = e.target?.result as string;
        setPreviewImage(imageData);
        
        // Analyze the image for ingredients
        toast({
          title: "Analyzing image",
          description: "Looking for ingredients in your image...",
        });
        
        // Use the AI recognition function from utils
        const recognizedIngredients = await recognizeIngredientsFromImage(imageData);
        
        if (recognizedIngredients.length === 0) {
          toast({
            title: "No ingredients found",
            description: "The image doesn't contain any recognizable ingredients",
            variant: "destructive"
          });
          return;
        }
        
        // Add each recognized ingredient
        recognizedIngredients.forEach(ingredient => {
          addIngredient(ingredient);
        });
        
        toast({
          title: "Analysis complete",
          description: `Found ${recognizedIngredients.length} ingredients in your image`,
        });
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: "Error processing image",
          description: "Could not analyze the image for ingredients",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Could not read the image file",
        variant: "destructive"
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
    
    // Reset the input
    event.target.value = "";
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
      />
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-200 transition-colors ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        <FileImage size={18} />
        <span>{isUploading ? 'Analyzing...' : 'Upload ingredient photo'}</span>
      </button>
      <p className="text-xs text-gray-500 mt-1">
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
