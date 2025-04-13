import React, { useState, useEffect } from 'react';
import { PhotoGridProvider } from './context/PhotoGridContext';
import PhotoUploader from './components/PhotoUploader';
import PhotoGrid from './components/PhotoGrid';
import PhotoCropper from './components/PhotoCropper';
import PhotoPreview from './components/PhotoPreview';

enum AppView {
  UPLOAD,
  PREVIEW
}

const App: React.FC = () => {
  const [appView, setAppView] = useState<AppView>(AppView.UPLOAD);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Add event listener to handle edit-photo events from PhotoCropper
  useEffect(() => {
    const handleEditPhotoEvent = (event: CustomEvent) => {
      const { id } = event.detail;
      setEditingPhotoId(id);
    };

    // Convert event to CustomEvent type
    document.addEventListener('edit-photo', handleEditPhotoEvent as EventListener);

    // Cleanup function
    return () => {
      document.removeEventListener('edit-photo', handleEditPhotoEvent as EventListener);
    };
  }, []);

  const handleEditPhoto = (id: string) => {
    setEditingPhotoId(id);
  };

  const handleCloseCropper = () => {
    setEditingPhotoId(null);
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Get photos from localStorage (since our app uses it via context)
      const photoGridData = localStorage.getItem('photoGridData');
      
      if (!photoGridData) {
        throw new Error('No photo data found');
      }
      
      const parsedData = JSON.parse(photoGridData);
      
      // Create a submission object with metadata
      const submission = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        photosCount: parsedData.photos.length,
        photoOrder: parsedData.photos.map((photo: any) => ({
          id: photo.id,
          name: photo.name || 'Unnamed',
          hasCropped: !!photo.croppedPreview
        }))
      };
      
      // Send to serverless function if in production (Vercel)
      if (process.env.NODE_ENV === 'production') {
        const response = await fetch('/api/save-submission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save submission');
        }
        
        const result = await response.json();
        console.log('Submission saved:', result);
      } else {
        // In development, just log to console
        console.log('DEV MODE - Submission:', submission);
      }
      
      // Show success message
      alert('Photo frame successfully submitted! Your photo arrangement has been saved.');
      
      // Reset form if needed
      // resetForm();
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Unknown error occurred');
      alert(`There was an error submitting your photos. Please try again. ${error instanceof Error ? error.message : ''}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTerms = () => {
    setShowTerms(!showTerms);
  };

  return (
    <PhotoGridProvider>
      <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <header className="mb-6 text-center">
            <div className="flex justify-center mb-2">
              <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156.62 36.9" className="h-10 sm:h-12 w-auto">
                <g id="Layer_1-2" data-name="Layer 1">
                  <g>
                    <path fill="#404041" d="M19.19,6.55c-.76-1.06-1.74-1.91-2.93-2.55-1.19-.64-2.63-.97-4.31-.97-.86,0-1.74.13-2.63.4-.89.27-1.7.67-2.43,1.22-.73.55-1.31,1.23-1.76,2.06-.45.83-.67,1.8-.67,2.93s.21,2.05.64,2.78c.43.73,1,1.35,1.71,1.86.71.51,1.52.93,2.42,1.26.91.33,1.85.66,2.84.99,1.22.4,2.45.83,3.68,1.29,1.24.46,2.35,1.07,3.34,1.81.99.74,1.8,1.69,2.42,2.83.63,1.14.94,2.59.94,4.34s-.33,3.27-1,4.54c-.67,1.27-1.54,2.32-2.6,3.15-1.07.83-2.29,1.44-3.66,1.83-1.37.4-2.75.59-4.14.59-1.06,0-2.12-.11-3.17-.32-1.06-.22-2.07-.54-3.03-.97-.96-.43-1.85-.97-2.68-1.64-.83-.66-1.55-1.42-2.18-2.28l3.07-2.28c.76,1.26,1.83,2.31,3.2,3.15,1.37.84,2.98,1.26,4.84,1.26.89,0,1.8-.14,2.73-.42.93-.28,1.76-.71,2.5-1.29.74-.58,1.36-1.29,1.83-2.13.48-.84.72-1.83.72-2.95,0-1.22-.24-2.24-.72-3.05-.48-.81-1.12-1.49-1.91-2.03-.79-.55-1.7-1-2.73-1.36-1.03-.36-2.1-.73-3.22-1.09-1.16-.36-2.3-.78-3.42-1.24-1.12-.46-2.13-1.07-3.03-1.81-.89-.74-1.61-1.66-2.16-2.75s-.82-2.43-.82-4.02c0-1.69.34-3.14,1.02-4.36.68-1.22,1.56-2.23,2.65-3.03,1.09-.79,2.3-1.37,3.62-1.74,1.32-.36,2.63-.55,3.92-.55,2.38,0,4.41.42,6.1,1.26,1.69.84,2.96,1.84,3.82,3l-2.83,2.28Z"/>
                    <path fill="#404041" d="M32.22,32.83h16.37v3.17h-19.94V.89h3.57v31.94Z"/>
                    <path fill="#404041" d="M55.07,36h-3.92L66.33.89h3.47l15.08,35.11h-3.97l-3.87-9.22-9.08-21.92-12.89,31.14ZM77.04,26.78l-9.08-21.92"/>
                    <path fill="#404041" d="M95.57,31.39h.1L107.08.89h3.82l-13.44,35.11h-3.77L80.3.89h3.87l11.41,30.5Z"/>
                    <path fill="#404041" d="M119.24,36h-3.57V.89h3.57v35.11Z"/>
                    <path fill="#404041" d="M126.82,36h-3.92L138.08.89h3.47l15.08,35.11h-3.97l-3.87-9.22-9.08-21.92-12.89,31.14ZM148.79,26.78l-9.08-21.92"/>
                  </g>
                </g>
              </svg>
            </div>
            <p className="text-gray-600 mt-1">Upload photos, automatically crop and arrange your 4x5 photo grid</p>
            <p className="text-xs text-gray-500 mt-2">By using our app, you accept our <button onClick={toggleTerms} className="text-blue-500 underline">Terms and Conditions</button></p>
          </header>

          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6">
              {appView === AppView.UPLOAD ? (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-800">1. Upload Your Photos</h2>
                      <span className="text-sm text-gray-500">20 photos • Auto crop to square</span>
                    </div>
                    <PhotoUploader />
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-800">2. Arrange & Adjust Photos</h2>
                      <span className="text-sm text-gray-500">Tap to crop</span>
                    </div>
                    <PhotoGrid onEditPhoto={handleEditPhoto} />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setAppView(AppView.PREVIEW)}
                      className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Preview Final Result
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-800">Preview Photo Grid</h2>
                    <span className="text-sm text-gray-500">Confirm your layout</span>
                  </div>
                  <PhotoPreview 
                    onBack={() => setAppView(AppView.UPLOAD)} 
                    onComplete={handleComplete}
                  />
                  
                  {submitError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {submitError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <footer className="mt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} SLAVIA LIMITED | All Rights Reserved | <button onClick={toggleTerms} className="text-blue-500 underline">Terms and Conditions</button></p>
          </footer>
        </div>

        {editingPhotoId && (
          <PhotoCropper
            photoId={editingPhotoId}
            onClose={handleCloseCropper}
          />
        )}

        {showTerms && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="p-5 border-b sticky top-0 bg-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Terms and Conditions</h2>
                <button 
                  onClick={toggleTerms}
                  className="text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
              </div>
              <div className="p-5 text-sm">
                <h1 className="text-xl font-bold mb-4">TERMS AND CONDITIONS FOR PHOTO WALL APPLICATION</h1>
                
                <p className="text-gray-500 mb-4"><strong>Last Updated: April 13, 2025</strong></p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">1. INTRODUCTION</h2>
                <p className="mb-4">Welcome to Photo Wall ("Application"). These Terms and Conditions ("Terms") constitute a legally binding agreement between you and the operators of Photo Wall ("we," "us," or "our") governing your access to and use of the Application.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">2. ACCEPTANCE OF TERMS</h2>
                <p className="mb-4">By accessing or using our Application, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Application.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">3. DESCRIPTION OF SERVICE</h2>
                <p className="mb-4">Photo Wall is a web application that allows users to upload up to 20 photographs, arrange their order, crop them to a 1:1 ratio, and preview them in a 4x5 grid wall frame layout.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">4. USER ACCOUNTS</h2>
                <p className="mb-2">4.1 You may be required to create an account to use certain features of our Application.</p>
                <p className="mb-2">4.2 You are responsible for maintaining the confidentiality of your account information and password.</p>
                <p className="mb-4">4.3 You are responsible for all activities that occur under your account.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">5. USER CONTENT</h2>
                <p className="mb-2">5.1 <strong>Ownership</strong>: You retain all ownership rights to the photographs you upload to our Application.</p>
                <p className="mb-2">5.2 <strong>License Grant</strong>: By uploading photographs to our Application, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, and display such content solely for the purpose of providing and improving our services.</p>
                <p className="mb-2">5.3 <strong>Prohibited Content</strong>: You agree not to upload content that:</p>
                <ul className="list-disc pl-8 mb-2">
                  <li>Infringes upon intellectual property rights of others</li>
                  <li>Contains sexually explicit material</li>
                  <li>Promotes violence, discrimination, or illegal activities</li>
                  <li>Violates any applicable law or regulation</li>
                  <li>Contains malware, viruses, or other harmful code</li>
                </ul>
                <p className="mb-4">5.4 <strong>Content Removal</strong>: We reserve the right to remove any content that violates these Terms or that we find objectionable for any reason, without prior notice.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">6. ACCEPTABLE USE</h2>
                <p className="mb-2">6.1 You agree to use our Application only for lawful purposes and in accordance with these Terms.</p>
                <p className="mb-2">6.2 You agree not to:</p>
                <ul className="list-disc pl-8 mb-4">
                  <li>Use our Application in any way that could disable, overburden, or impair the Application</li>
                  <li>Use any robot, spider, or other automatic device to access our Application</li>
                  <li>Attempt to gain unauthorized access to secured portions of the Application</li>
                  <li>Engage in any conduct that restricts or inhibits anyone's use of the Application</li>
                  <li>Use the Application to send unsolicited communications</li>
                </ul>
                
                <h2 className="text-lg font-bold mt-6 mb-2">7. INTELLECTUAL PROPERTY RIGHTS</h2>
                <p className="mb-2">7.1 The Application, including its content, features, and functionality, is owned by us and is protected by copyright, trademark, and other intellectual property laws.</p>
                <p className="mb-4">7.2 You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any portion of our Application without our prior written consent.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">8. PRIVACY</h2>
                <p className="mb-4">8.1 Our collection and use of personal information in connection with the Application is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">9. DISCLAIMERS</h2>
                <p className="mb-2">9.1 THE APPLICATION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND.</p>
                <p className="mb-2">9.2 WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                <p className="mb-2">9.3 We do not guarantee that:</p>
                <ul className="list-disc pl-8 mb-4">
                  <li>The Application will always be available or uninterrupted</li>
                  <li>Any errors in the Application will be corrected</li>
                  <li>The Application or its content is free of viruses or other harmful components</li>
                </ul>
                
                <h2 className="text-lg font-bold mt-6 mb-2">10. LIMITATION OF LIABILITY</h2>
                <p className="mb-2">10.1 TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>
                <p className="mb-4">10.2 OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING OUR APPLICATION.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">11. INDEMNIFICATION</h2>
                <p className="mb-4">11.1 You agree to indemnify, defend, and hold harmless us and our affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses arising out of or related to your violation of these Terms or your use of the Application.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">12. TERMINATION</h2>
                <p className="mb-2">12.1 We may terminate or suspend your access to the Application immediately, without prior notice, for any reason, including if you breach these Terms.</p>
                <p className="mb-2">12.2 Upon termination, your right to use the Application will immediately cease.</p>
                <p className="mb-4">12.3 All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">13. CHANGES TO TERMS</h2>
                <p className="mb-2">13.1 We reserve the right to modify these Terms at any time.</p>
                <p className="mb-2">13.2 Updated Terms will be posted on this page with a revised "Last Updated" date.</p>
                <p className="mb-4">13.3 Your continued use of the Application after any changes to the Terms constitutes your acceptance of such changes.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">14. GOVERNING LAW</h2>
                <p className="mb-2">14.1 These Terms shall be governed by and construed in accordance with the laws of Hong Kong, without regard to its conflict of law provisions.</p>
                <p className="mb-4">14.2 Any legal suit, action, or proceeding arising out of or related to these Terms or the Application shall be instituted exclusively in the courts of Hong Kong.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">15. SEVERABILITY</h2>
                <p className="mb-4">15.1 If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">16. WAIVER</h2>
                <p className="mb-4">16.1 Our failure to enforce any right or provision of these Terms will not be considered a waiver of such right or provision.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">17. ENTIRE AGREEMENT</h2>
                <p className="mb-4">17.1 These Terms, together with the Privacy Policy, constitute the entire agreement between you and us regarding your use of the Application.</p>
                
                <h2 className="text-lg font-bold mt-6 mb-2">18. CONTACT INFORMATION</h2>
                <p className="mb-4">18.1 If you have any questions about these Terms, please contact us at: slaviaframe@gmail.com</p>
              </div>
              <div className="p-5 border-t sticky bottom-0 bg-white">
                <button 
                  onClick={toggleTerms}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PhotoGridProvider>
  );
};

export default App;
