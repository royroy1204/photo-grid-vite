import React, { useRef, useState } from 'react';
import { usePhotoGrid } from '../context/PhotoGridContext';
import { FiDownload, FiArrowLeft, FiSend, FiCheck } from 'react-icons/fi';

interface PhotoPreviewProps {
  onBack: () => void;
  onComplete: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ onBack, onComplete }) => {
  const { photos } = usePhotoGrid();
  const [zoom, setZoom] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const hasAllPhotos = photos.length === 20;
  const allCropped = photos.every(photo => !!photo.croppedPreview);

  const handleDownload = () => {
    if (!previewRef.current) return;

    // In a real application, use canvas or backend service to generate high-quality images
    // This is just an example of how to take a snapshot of a DOM element
    alert('In a real application, this would implement a download feature');
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Collect all cropped photo data
      const photosData = photos.map((photo, index) => ({
        id: photo.id,
        order: index + 1,
        data: photo.croppedPreview || photo.preview
      }));
      
      // Log photo data for debugging
      console.log(`Processing ${photosData.length} photos for submission`);
      
      // In a real application, this would be an API request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate completion
      setSubmitted(true);
      
      // Notify parent component that operation is complete
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      console.error('Error submitting photos:', error);
      alert('An error occurred while submitting photos. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!allCropped) {
    return (
      <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-yellow-700 font-medium">Please crop all photos first</h3>
        <p className="text-yellow-600 mt-2">
          You have {photos.filter(p => !p.croppedPreview).length} photos that need to be cropped.
          Please go back and crop all photos.
        </p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Return to Edit
        </button>
      </div>
    );
  }

  if (!hasAllPhotos) {
    return (
      <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-blue-700 font-medium">20 photos required</h3>
        <p className="text-blue-600 mt-2">
          You've uploaded {photos.length} photos so far. You need to upload {20 - photos.length} more.
        </p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          disabled={submitting || submitted}
          className={`px-4 py-2 flex items-center ${
            submitting || submitted ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          <FiArrowLeft className="mr-2" /> Back to Edit
        </button>
        <div className="flex items-center">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
            disabled={submitting || submitted}
          >
            <FiDownload className="mr-2" /> Download Preview
          </button>
          {submitted ? (
            <button
              disabled
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center cursor-not-allowed"
            >
              <FiCheck className="mr-2" /> Submitted
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`ml-2 px-4 py-2 ${
                submitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded-lg transition-colors flex items-center`}
            >
              {submitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="mr-2" /> Submit Photo Grid
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-auto bg-gray-50 p-8 rounded-lg shadow-inner">
        <div className="flex justify-center">
          <div 
            style={{ 
              width: `${Math.round(900 * zoom)}px`,
              transition: 'all 0.3s ease',
            }}
          >
            {/* White main frame */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm" ref={previewRef}>
              {/* Photo grid */}
              <div className="grid grid-cols-4 grid-rows-5 gap-6 bg-white">
                {photos.map((photo, index) => (
                  <div 
                    key={photo.id} 
                    className="relative"
                    style={{ 
                      transformOrigin: 'center center',
                    }}
                  >
                    {/* Instax style photo */}
                    <div 
                      className="bg-white rounded-md overflow-hidden relative"
                      style={{
                        boxShadow: '0 3px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)'
                      }}
                    >
                      {/* Instax frame */}
                      <div className="absolute inset-0 border-[10px] border-white rounded-md z-10 pointer-events-none"></div>
                      
                      {/* Photo area */}
                      <div className="pt-[10px] px-[10px] pb-[36px]">
                        <div className="bg-black aspect-square overflow-hidden">
                          <img 
                            src={photo.croppedPreview || photo.preview} 
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Instax bottom text only */}
                      <div className="absolute bottom-0 left-0 right-0 h-[30px] flex items-center justify-center px-3">
                        <span className="text-xs text-gray-400 font-light tracking-wide">INSTAX #{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {submitted && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-700 font-medium">
            <FiCheck className="inline-block mr-2" /> 
            Photo grid successfully submitted!
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoPreview; 