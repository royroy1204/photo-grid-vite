import React, { createContext, useState, useContext } from 'react';
import { PhotoGridContextType, PhotoItem } from '../types';

const MAX_PHOTOS = 20;

const PhotoGridContext = createContext<PhotoGridContextType | undefined>(undefined);

export const PhotoGridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // 自動裁剪圖片為1:1比例
  const autoCropImage = (file: File): Promise<{ croppedPreview: string, cropData: any }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        // 獲取原始尺寸
        const originalWidth = img.width;
        const originalHeight = img.height;
        
        // 確定裁剪尺寸和位置
        const size = Math.min(originalWidth, originalHeight);
        const x = (originalWidth - size) / 2;
        const y = (originalHeight - size) / 2;
        
        // 創建 canvas 進行裁剪
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
          const croppedPreview = canvas.toDataURL('image/jpeg');
          
          const cropData = {
            x,
            y,
            width: size,
            height: size
          };
          
          resolve({ croppedPreview, cropData });
        }
        
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    });
  };

  const addPhotos = async (files: File[]) => {
    // 處理自動裁剪
    const processedPhotos = await Promise.all(
      files.map(async (file, index) => {
        const preview = URL.createObjectURL(file);
        const { croppedPreview, cropData } = await autoCropImage(file);
        
        return {
          id: `${Date.now()}-${index}`,
          file,
          preview,
          position: photos.length + index,
          croppedPreview,
          cropData
        };
      })
    );

    // 限制最多20張照片
    const combinedPhotos = [...photos, ...processedPhotos];
    const limitedPhotos = combinedPhotos.slice(0, MAX_PHOTOS);
    
    setPhotos(limitedPhotos);
  };

  const removePhoto = (id: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    // 更新位置
    const reindexedPhotos = updatedPhotos.map((photo, index) => ({
      ...photo,
      position: index,
    }));
    setPhotos(reindexedPhotos);
  };

  const updatePhotoOrder = (startIndex: number, endIndex: number) => {
    const result = Array.from(photos);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // 更新位置
    const reindexedPhotos = result.map((photo, index) => ({
      ...photo,
      position: index,
    }));
    
    setPhotos(reindexedPhotos);
  };

  const updateCrop = (id: string, cropData: PhotoItem['cropData'], croppedPreview: string) => {
    const updatedPhotos = photos.map(photo => 
      photo.id === id 
        ? { ...photo, cropData, croppedPreview } 
        : photo
    );
    setPhotos(updatedPhotos);
  };

  const value = {
    photos,
    addPhotos,
    removePhoto,
    updatePhotoOrder,
    updateCrop,
    maxPhotos: MAX_PHOTOS,
  };

  return (
    <PhotoGridContext.Provider value={value}>
      {children}
    </PhotoGridContext.Provider>
  );
};

export const usePhotoGrid = (): PhotoGridContextType => {
  const context = useContext(PhotoGridContext);
  if (context === undefined) {
    throw new Error('usePhotoGrid must be used within a PhotoGridProvider');
  }
  return context;
}; 