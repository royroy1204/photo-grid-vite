export interface PhotoItem {
  id: string;
  file: File;
  preview: string;
  croppedPreview?: string;
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  position: number;
}

export type PhotoGridContextType = {
  photos: PhotoItem[];
  addPhotos: (files: File[]) => void;
  removePhoto: (id: string) => void;
  updatePhotoOrder: (startIndex: number, endIndex: number) => void;
  updateCrop: (id: string, cropData: PhotoItem['cropData'], croppedPreview: string) => void;
  maxPhotos: number;
}; 