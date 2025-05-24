
import { ingredients } from './mockData';

// Simulating AI recognition of ingredients from an image
export const recognizeIngredientsFromImage = async (imageData) => {
  // In a real app, this would send the image to an AI service
  // For this demo, we'll randomly select 2-4 ingredients to simulate recognition
  
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Randomly select between 2 to 4 ingredients
      const count = Math.floor(Math.random() * 3) + 2;
      const shuffled = [...ingredients].sort(() => 0.5 - Math.random());
      const selectedIngredients = shuffled.slice(0, count);
      
      // Log the "recognized" ingredients for debugging
      console.log('AI recognized ingredients:', selectedIngredients.map(i => i.name));
      
      resolve(selectedIngredients);
    }, 1500); // Simulate a 1.5 second processing time
  });
};

// Function to capture image from camera
export const captureImage = async () => {
  try {
    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    
    // Create a video element to display the stream
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    
    // Wait for video to be loaded
    await new Promise(resolve => {
      video.onloadedmetadata = resolve;
    });
    
    // Create a canvas to capture the image
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to the canvas
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    
    // Stop the camera stream
    stream.getTracks().forEach(track => track.stop());
    
    // Convert canvas to base64 image data
    const imageData = canvas.toDataURL('image/jpeg');
    
    return imageData;
  } catch (error) {
    console.error('Error capturing image:', error);
    throw new Error('Failed to capture image from camera');
  }
};
