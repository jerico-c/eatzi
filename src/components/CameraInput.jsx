import React, { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon } from 'lucide-react'; 
import { useRecipe } from '../context/RecipeContext';
import { toast } from 'sonner';

class Camera {
    #currentStream;
    #streaming = false;
    #width = 640; 
    #height = 0;
  
    #selectCameraElement;
    #videoElement;
    #canvasElement;

    static addNewStream(stream) {
      if (!stream) return;
      if (!Array.isArray(window.currentStreams)) {
        window.currentStreams = [stream];
        return;
      }
      window.currentStreams = [...window.currentStreams, stream];
    }

    static stopAllStreams() {
      if (!Array.isArray(window.currentStreams)) {
        window.currentStreams = [];
        return;
      }
      window.currentStreams.forEach((stream) => {
        if (stream && stream.active) {
          stream.getTracks().forEach((track) => track.stop());
        }
      });
      window.currentStreams = [];
    }
  
    constructor({ video, cameraSelect, canvas, options = {} }) {
      this.#videoElement = video;
      this.#selectCameraElement = cameraSelect;
      this.#canvasElement = canvas;
      this.#width = options.width || this.#width;
      this.#initialListener();
    }
  
    #initialListener() {
      if (!this.#videoElement || !this.#selectCameraElement || !this.#canvasElement) {
        console.error("Camera class: Missing required DOM elements in constructor.");
        return;
      }

      this.#videoElement.oncanplay = () => {
        if (this.#streaming) {
          return;
        }
        if (this.#videoElement.videoWidth > 0) {
            this.#height = (this.#videoElement.videoHeight * this.#width) / this.#videoElement.videoWidth;
            this.#videoElement.setAttribute('width', this.#width.toString());
            this.#videoElement.setAttribute('height', this.#height.toString());
            this.#canvasElement.setAttribute('width', this.#width.toString());
            this.#canvasElement.setAttribute('height', this.#height.toString());
            this.#streaming = true;
        }
      };
  
      this.#selectCameraElement.onchange = async () => {
        await this.stop();
        await this.launch();
      };
    }
  
    async #populateDeviceList(stream) {
      try {
        if (!(stream instanceof MediaStream)) {
          console.error('MediaStream not found for populating device list!');
          return;
        }
        const videoTracks = stream.getVideoTracks();
        if (!videoTracks || videoTracks.length === 0) {
            console.error('No video tracks found in the stream.');
            if (this.#selectCameraElement) this.#selectCameraElement.innerHTML = '<option value="">No cameras found</option>';
            return;
        }
        const { deviceId } = videoTracks[0].getSettings();
        const enumeratedDevices = await navigator.mediaDevices.enumerateDevices();
        const list = enumeratedDevices.filter((device) => device.kind === 'videoinput');

        if (list.length === 0) {
            if (this.#selectCameraElement) this.#selectCameraElement.innerHTML = '<option value="">No cameras found</option>';
            return;
        }

        const html = list.reduce((accumulator, device, currentIndex) => {
          return accumulator.concat(`
            <option
              value="${device.deviceId}"
              ${deviceId === device.deviceId ? 'selected' : ''}
            >
              ${device.label || `Camera ${currentIndex + 1}`}
            </option>
          `);
        }, '');
        if (this.#selectCameraElement) this.#selectCameraElement.innerHTML = html;
      } catch (error) {
        console.error('#populateDeviceList: error:', error);
        if (this.#selectCameraElement) this.#selectCameraElement.innerHTML = '<option value="">Error listing cameras</option>';
      }
    }
  
    async #getStream() {
      try {
        let videoConstraints = {
            aspectRatio: 4/3,
            width: { ideal: this.#width }
        };

        if (this.#selectCameraElement && this.#selectCameraElement.value) {
            videoConstraints.deviceId = { exact: this.#selectCameraElement.value };
        }
  
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false
        });
        
        if (this.#selectCameraElement) {
            await this.#populateDeviceList(stream);
        }
  
        return stream;
      } catch (error) {
        console.error('#getStream: error:', error);
        toast.error("Could not access camera. Please ensure permissions are granted.");
        return null; 
      }
    }
  
    async takePicture() {
      if (!(this.#width && this.#height && this.#streaming && this.#videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA)) {
        console.warn("Cannot take picture: Camera not ready, dimensions not set, or no current data.");
        return null;
      }
      const context = this.#canvasElement.getContext('2d');
      const currentVideoWidth = this.#videoElement.videoWidth;
      const currentVideoHeight = this.#videoElement.videoHeight;

      this.#canvasElement.width = currentVideoWidth; 
      this.#canvasElement.height = currentVideoHeight;
      context.drawImage(this.#videoElement, 0, 0, currentVideoWidth, currentVideoHeight);
      
      return await new Promise((resolve) => {
        this.#canvasElement.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
      });
    }
  
    async launch() {
      if (!this.#videoElement) {
          console.error("Video element not available to launch camera.");
          return;
      }
      
      if (this.#selectCameraElement && !this.#selectCameraElement.value) {
        try {
            const tempStreamForListing = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            await this.#populateDeviceList(tempStreamForListing);
            tempStreamForListing.getTracks().forEach(track => track.stop());
        } catch (err) {
            console.error("Error getting temp stream for listing:", err);
            toast.error("Failed to list cameras. Please grant camera permission.");
            if (this.#selectCameraElement) this.#selectCameraElement.innerHTML = '<option value="">No cameras accessible</option>';
            return; 
        }
      }

      this.#currentStream = await this.#getStream();
      
      if (!this.#currentStream) {
        console.error("Failed to launch camera: No stream obtained.");
        return;
      }
  
      Camera.addNewStream(this.#currentStream);
  
      this.#videoElement.srcObject = this.#currentStream;
      this.#videoElement.play().catch(e => console.error("Error playing video:", e));
      this.#clearCanvas();
    }
  
    stop() {
      if (this.#videoElement) {
        this.#videoElement.pause();
        this.#videoElement.srcObject = null;
      }
      
      if (this.#currentStream instanceof MediaStream && this.#currentStream.active) {
        this.#currentStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      this.#currentStream = null;
      this.#streaming = false;
      this.#clearCanvas();
    }
  
    #clearCanvas() {
      if (!this.#canvasElement) return;
      const context = this.#canvasElement.getContext('2d');
      context.fillStyle = '#DDDDDD';
      context.fillRect(0, 0, this.#canvasElement.width, this.#canvasElement.height);
    }
}
// Akhir dari definisi Kelas Camera

// Helper function to convert Blob to data URL for preview
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    if (!blob) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const CameraInput = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const { addIngredient } = useRecipe();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraSelectRef = useRef(null);
  const cameraInstanceRef = useRef(null);

  const API_ENDPOINT = 'http://192.168.1.23:5001/klasifikasi_gambar';

  useEffect(() => {
    if (showCamera && videoRef.current && cameraSelectRef.current && canvasRef.current) {
      if (!cameraInstanceRef.current) {
        cameraInstanceRef.current = new Camera({ 
          video: videoRef.current,
          cameraSelect: cameraSelectRef.current,
          canvas: canvasRef.current,
          options: { width: 320 } 
        });
      }
      cameraInstanceRef.current.launch()
        .then(() => console.log("Camera launched"))
        .catch(err => {
            console.error("Failed to launch camera from useEffect", err);
            toast.error("Failed to launch camera. Check permissions.");
            setShowCamera(false);
        });
    } else if (!showCamera && cameraInstanceRef.current) {
        cameraInstanceRef.current.stop();
    }

    return () => {
      if (cameraInstanceRef.current) {
        cameraInstanceRef.current.stop();
      }
    };
  }, [showCamera]);


  const handleToggleCamera = () => {
    setShowCamera(prev => !prev);
    if (showCamera) {
        setPreviewImage(null);
    }
  };

  const handleTakePictureAndUpload = async () => {
    if (!cameraInstanceRef.current) {
      toast.error("Camera is not initialized.");
      return;
    }

    try {
      setIsCapturing(true);
      toast.info("Capturing image...");

      const imageBlob = await cameraInstanceRef.current.takePicture();
      
      if (!imageBlob) {
        throw new Error('Failed to capture image. Is the camera active?');
      }

      const imageDataUrlPreview = await blobToDataURL(imageBlob);
      setPreviewImage(imageDataUrlPreview);
      
      const formData = new FormData();
      formData.append('file', imageBlob, 'ingredient_scan.jpg'); 

      toast.info("Sending image to API for classification...");
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText || response.statusText}`);
      }

      const classificationResult = await response.json();

      if (classificationResult && classificationResult.ingredients && Array.isArray(classificationResult.ingredients)) {
        classificationResult.ingredients.forEach(ingredientName => {
          if (typeof ingredientName === 'string' && ingredientName.trim() !== '') {
            addIngredient({ name: ingredientName, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
          }
        });
        toast.success(`API found ${classificationResult.ingredients.length} ingredients!`);
      } else if (Array.isArray(classificationResult)) {
        classificationResult.forEach(ingredientName => {
           if (typeof ingredientName === 'string' && ingredientName.trim() !== '') {
             addIngredient({ name: ingredientName, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
           }
        });
        toast.success(`API found ${classificationResult.length} ingredients!`);
      } else {
        console.warn("API response format not recognized for ingredients:", classificationResult);
        toast.info("Image classified, but ingredient format was unexpected.");
      }
    } catch (error) {
      console.error('Error taking picture or uploading:', error);
      toast.error(error.message || 'Failed to process image');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Tombol yang dimodifikasi styling-nya */}
      <button
        onClick={handleToggleCamera}
        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mb-2"
      >
        <CameraIcon size={18} /> {/* Menggunakan CameraIcon yang sudah diimpor */}
        <span>{showCamera ? 'Hide Camera' : 'Open Camera to Scan'}</span>
      </button>

      {showCamera && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50"> {/* Latar belakang bagian kamera juga bg-gray-50 agar serasi */}
          <div className="mb-2">
            <label htmlFor="cameraSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Camera:</label>
            <select id="cameraSelect" ref={cameraSelectRef} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></select>
          </div>
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-auto max-w-md mx-auto bg-gray-800 rounded" // Latar video bisa disesuaikan
            style={{ transform: 'scaleX(-1)' }}
          >
            Your browser does not support the video tag.
          </video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          
          {/* Tombol Scan & Upload di dalam view kamera bisa tetap menggunakan style foodie jika diinginkan, atau disamakan */}
          <button
            onClick={handleTakePictureAndUpload}
            disabled={isCapturing}
            className="w-full mt-3 bg-foodie-500 hover:bg-foodie-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            // Jika ingin disamakan juga:
            // className="w-full mt-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <CameraIcon size={18} />
            <span>{isCapturing ? 'Processing...' : 'Scan & Upload Ingredients'}</span>
          </button>
        </div>
      )}
      
      {previewImage && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Last captured image:</p>
          <div className="relative w-full max-w-md mx-auto h-auto bg-gray-100 rounded-lg overflow-hidden aspect-video">
            <img
              src={previewImage}
              alt="Captured ingredients"
              className="w-full h-full object-contain"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraInput;
