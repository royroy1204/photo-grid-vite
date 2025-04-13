import React from 'react';
import { usePhotoGrid } from '../context/PhotoGridContext';
import { FiTrash2, FiCrop, FiCheck, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface PhotoGridProps {
  onEditPhoto: (id: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ onEditPhoto }) => {
  const { photos, updatePhotoOrder, removePhoto } = usePhotoGrid();

  const movePhoto = (fromIndex: number, toIndex: number) => {
    if (toIndex >= 0 && toIndex < photos.length) {
      updatePhotoOrder(fromIndex, toIndex);
    }
  };

  const moveUp = (index: number) => {
    // Calculate row and column index
    const row = Math.floor(index / 4);
    const col = index % 4;
    
    // If not the first row, move up
    if (row > 0) {
      const targetIndex = (row - 1) * 4 + col;
      if (targetIndex >= 0) {
        movePhoto(index, targetIndex);
      }
    }
  };

  const moveDown = (index: number) => {
    // Calculate row and column index
    const row = Math.floor(index / 4);
    const col = index % 4;
    
    // If not the last row, move down
    const targetIndex = (row + 1) * 4 + col;
    if (targetIndex < photos.length) {
      movePhoto(index, targetIndex);
    }
  };

  const moveLeft = (index: number) => {
    // If not the first column, move left
    if (index % 4 > 0) {
      movePhoto(index, index - 1);
    }
  };

  const moveRight = (index: number) => {
    // If not the last column, move right
    if (index % 4 < 3 && index < photos.length - 1) {
      movePhoto(index, index + 1);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No photos uploaded yet</p>
        <p className="text-sm text-gray-400 mt-2">Upload photos to start creating your photo grid</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="text-center mb-4 text-sm text-gray-500">
          <span className="bg-white px-3 py-1 rounded-full border border-gray-200 inline-flex items-center mx-1">
            <FiCheck className="mr-1 text-green-500" /> 
            Cropped: {photos.filter(p => p.croppedPreview).length}/{photos.length}
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`relative aspect-square rounded-md overflow-hidden border-2 bg-white ${
                photo.croppedPreview ? 'border-green-500' : 'border-gray-200'
              }`}
            >
              <img 
                src={photo.croppedPreview || photo.preview} 
                alt={`Photo ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white rounded-br-lg px-2 py-1 text-xs">
                {index + 1}
              </div>

              {photo.croppedPreview && (
                <div className="absolute top-0 right-0 bg-green-500 text-white rounded-bl-lg p-1">
                  <FiCheck size={12} />
                </div>
              )}

              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 flex flex-col items-center justify-center">
                <div className="grid grid-cols-3 gap-1 mb-3">
                  <div></div>
                  <button
                    onClick={() => moveUp(index)}
                    disabled={Math.floor(index / 4) === 0}
                    className={`p-1.5 bg-white rounded-full ${Math.floor(index / 4) === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 text-blue-500'}`}
                  >
                    <FiArrowUp size={16} />
                  </button>
                  <div></div>
                  
                  <button
                    onClick={() => moveLeft(index)}
                    disabled={index % 4 === 0}
                    className={`p-1.5 bg-white rounded-full ${index % 4 === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 text-blue-500'}`}
                  >
                    <FiArrowLeft size={16} />
                  </button>
                  
                  <div className="p-1.5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs">{index + 1}</span>
                  </div>
                  
                  <button
                    onClick={() => moveRight(index)}
                    disabled={index % 4 === 3 || index === photos.length - 1}
                    className={`p-1.5 bg-white rounded-full ${index % 4 === 3 || index === photos.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 text-blue-500'}`}
                  >
                    <FiArrowRight size={16} />
                  </button>
                  
                  <div></div>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={(Math.floor(index / 4) === Math.floor((photos.length - 1) / 4) && index % 4 <= (photos.length - 1) % 4)}
                    className={`p-1.5 bg-white rounded-full ${(Math.floor(index / 4) === Math.floor((photos.length - 1) / 4) && index % 4 <= (photos.length - 1) % 4) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 text-blue-500'}`}
                  >
                    <FiArrowDown size={16} />
                  </button>
                  <div></div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditPhoto(photo.id)}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    title="Crop Photo"
                  >
                    <FiCrop size={16} />
                  </button>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Photo"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty placeholder elements */}
          {Array.from({ length: 20 - photos.length }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="aspect-square rounded-md border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center"
            >
              <span className="text-gray-300 text-xs">Empty</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
          Uploaded <span className="font-semibold">{photos.length}/20</span> photos
        </div>
      </div>
    </div>
  );
};

export default PhotoGrid; 