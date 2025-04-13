import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePhotoGrid } from '../context/PhotoGridContext';
import { FiUpload, FiImage, FiCheck } from 'react-icons/fi';

interface FileUploadProgress {
  id: string;
  name: string;
  progress: number;
  completed: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const PhotoUploader: React.FC = () => {
  const { addPhotos, photos, maxPhotos } = usePhotoGrid();
  const [uploadingFiles, setUploadingFiles] = useState<FileUploadProgress[]>([]);

  const remainingSlots = maxPhotos - photos.length;
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter non-image files
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length === 0) {
      alert('Please upload only image files (jpg, png, webp, etc.)');
      return;
    }

    // Check file sizes and filter out files that are too large
    const validSizeFiles = imageFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" exceeds the 10MB size limit and will be skipped.`);
        return false;
      }
      return true;
    });

    if (validSizeFiles.length === 0) {
      return;
    }

    // Limit quantity
    const limitedFiles = validSizeFiles.slice(0, remainingSlots);
    
    // Create upload progress object for each file
    const newUploadingFiles = limitedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      name: file.name,
      progress: 0,
      completed: false
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    
    // Simulate upload progress for each file
    newUploadingFiles.forEach((fileProgress, index) => {
      const updateInterval = setInterval(() => {
        setUploadingFiles(currentFiles => {
          const updatedFiles = [...currentFiles];
          const fileIndex = updatedFiles.findIndex(f => f.id === fileProgress.id);
          
          if (fileIndex === -1) {
            clearInterval(updateInterval);
            return currentFiles;
          }
          
          if (updatedFiles[fileIndex].progress >= 100) {
            updatedFiles[fileIndex].completed = true;
            clearInterval(updateInterval);
            return updatedFiles;
          }
          
          // Increase progress with slight variation to simulate actual upload
          updatedFiles[fileIndex].progress += Math.random() * 5 + 5;
          if (updatedFiles[fileIndex].progress > 100) {
            updatedFiles[fileIndex].progress = 100;
            updatedFiles[fileIndex].completed = true;
          }
          
          return updatedFiles;
        });
      }, 200 + index * 50); // Slightly different update rate for different files
      
      // Clean up progress bars after completion
      setTimeout(() => {
        setUploadingFiles(currentFiles => 
          currentFiles.filter(f => f.id !== fileProgress.id)
        );
      }, 2500 + index * 300);
    });

    addPhotos(limitedFiles);
  }, [addPhotos, remainingSlots]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    disabled: remainingSlots <= 0,
    maxSize: MAX_FILE_SIZE
  });

  if (remainingSlots <= 0) {
    return (
      <div className="p-4 text-center bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-gray-600 font-medium">Maximum photo limit reached ({maxPhotos})</p>
        <p className="text-sm text-gray-500 mt-1">Please delete some photos to continue uploading</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      <div 
        {...getRootProps()} 
        className={`p-4 border-2 border-dashed rounded-lg text-center transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-3">
          {isDragActive ? (
            <FiImage className="text-blue-500 mb-2" size={36} />
          ) : (
            <FiUpload className="text-gray-400 mb-2" size={32} />
          )}
          
          <p className="text-gray-600 font-medium">
            {isDragActive 
              ? 'Drop photos here...' 
              : 'Click or drag photos here to upload'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports JPG, PNG, WEBP formats • Up to {remainingSlots} photos • Max 10MB per file
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Photos will be automatically cropped to 1:1 square ratio, you can adjust later
          </p>
        </div>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">Processing photos:</p>
          {uploadingFiles.map(file => (
            <div key={file.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium truncate max-w-[250px]">{file.name}</span>
                  {file.completed && (
                    <span className="ml-2 text-green-500">
                      <FiCheck size={16} />
                    </span>
                  )}
                </div>
                <span className="text-gray-500">{Math.min(100, Math.round(file.progress))}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${file.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, file.progress)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader; 