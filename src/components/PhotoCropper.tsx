import React, { useState } from 'react';
import { Cropper } from 'react-cropper';
// import 'cropperjs/dist/cropper.css'; // 註釋掉直接引入
import { usePhotoGrid } from '../context/PhotoGridContext';
import { FiCheck, FiX, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi';

interface PhotoCropperProps {
  photoId: string | null;
  onClose: () => void;
}

const PhotoCropper: React.FC<PhotoCropperProps> = ({ photoId, onClose }) => {
  const { photos, updateCrop } = usePhotoGrid();
  const [loading, setLoading] = useState(false);
  const cropperRef = React.useRef<any>(null);

  // Find the current photo to crop and its index
  const selectedPhoto = photos.find(photo => photo.id === photoId);
  const currentPhotoIndex = selectedPhoto ? photos.indexOf(selectedPhoto) : -1;

  if (!selectedPhoto) {
    return null;
  }

  const handleCrop = async () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      setLoading(true);
      
      try {
        const cropper = cropperRef.current.cropper;
        const cropData = cropper.getData();
        const croppedCanvas = cropper.getCroppedCanvas({
          width: 500,
          height: 500,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        });
        
        const croppedImageUrl = croppedCanvas.toDataURL('image/jpeg');
        
        updateCrop(selectedPhoto.id, cropData, croppedImageUrl);
        
        // If there's a next photo, automatically move to it
        if (currentPhotoIndex < photos.length - 1) {
          const nextId = photos[currentPhotoIndex + 1].id;
          console.log(`Preparing to move to next photo: ${nextId}`);
          onClose();
          // To avoid recursion issues, we'll handle the next photo in App.tsx
        } else {
          onClose();
        }
      } catch (error) {
        console.error('Cropping error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const rotateImage = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.rotate(90);
    }
  };

  const zoomIn = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.zoom(0.1);
    }
  };

  const zoomOut = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.zoom(-0.1);
    }
  };

  const goToPrev = () => {
    if (currentPhotoIndex > 0) {
      const prevId = photos[currentPhotoIndex - 1].id;
      onClose(); // Close the current cropper window first
      // Use timeout to ensure the current modal is fully closed
      setTimeout(() => {
        // Notify the App component to open the cropper for the previous photo
        document.dispatchEvent(new CustomEvent('edit-photo', { detail: { id: prevId } }));
      }, 100);
    }
  };

  const goToNext = () => {
    if (currentPhotoIndex < photos.length - 1) {
      const nextId = photos[currentPhotoIndex + 1].id;
      onClose(); // Close the current cropper window first
      // Use timeout to ensure the current modal is fully closed
      setTimeout(() => {
        // Notify the App component to open the cropper for the next photo
        document.dispatchEvent(new CustomEvent('edit-photo', { detail: { id: nextId } }));
      }, 100);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[650px] m-3">
        <div className="p-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            Crop Photo to 1:1 Ratio
            <span className="ml-2 text-sm text-gray-500">
              ({currentPhotoIndex + 1}/{photos.length})
            </span>
          </h2>
          <div className="flex items-center space-x-3">
            <button 
              onClick={rotateImage}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Rotate Photo"
            >
              <FiRotateCw size={22} />
            </button>
            <button 
              onClick={zoomOut}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Zoom Out"
            >
              <FiZoomOut size={22} />
            </button>
            <button 
              onClick={zoomIn}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Zoom In"
            >
              <FiZoomIn size={22} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Close"
            >
              <FiX size={22} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-2">
          <Cropper
            src={selectedPhoto.preview}
            style={{ height: 450, width: '100%', maxWidth: 600 }}
            aspectRatio={1}
            guides={true}
            ref={cropperRef}
            viewMode={1}
            dragMode="move"
            autoCropArea={0.9}
            zoomable={true}
            cropBoxResizable={true}
            cropBoxMovable={true}
            background={true}
            responsive={true}
            checkOrientation={false}
            minCropBoxWidth={100}
            minCropBoxHeight={100}
            data={selectedPhoto.cropData}
          />
        </div>
        
        <div className="p-3 border-t flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrev}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-1"
              disabled={currentPhotoIndex === 0 || loading}
            >
              <span>Previous</span>
            </button>
            <button
              onClick={goToNext}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-1"
              disabled={currentPhotoIndex === photos.length - 1 || loading}
            >
              <span>Next</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <FiCheck className="mr-2" />
              )}
              Confirm Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCropper; 