
import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { captureImage, recognizeIngredientsFromImage } from '../utils/aiRecognition';
import { useRecipe } from '../context/RecipeContext';
import { toast } from 'sonner';

const CameraInput: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { addIngredient } = useRecipe();

  const handleCapture = async () => {
    try {
      setIsCapturing(true);
      
      // Capture image
      const imageData = await captureImage();
      setPreviewImage(imageData);
      
      // Recognize ingredients
      toast.info("Analyzing ingredients...");
      const recognizedIngredients = await recognizeIngredientsFromImage(imageData);
      
      // Add recognized ingredients
      recognizedIngredients.forEach(ingredient => {
        addIngredient(ingredient);
      });
      
      toast.success(`Found ${recognizedIngredients.length} ingredients!`);
    } catch (error) {
      console.error('Error capturing image:', error);
      toast.error('Failed to capture or analyze image');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleCapture}
        disabled={isCapturing}
        className="w-full bg-foodie-500 hover:bg-foodie-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Camera size={18} />
        <span>{isCapturing ? 'Processing...' : 'Scan Ingredients with Camera'}</span>
      </button>
      
      {previewImage && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Last captured image:</p>
          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={previewImage}
              alt="Captured ingredients"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraInput;
