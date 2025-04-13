import React, { useState, useEffect } from 'react';

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Create base64 encoded credentials
      const credentials = btoa(`${username}:${password}`);
      
      // Fetch submissions with authentication
      const response = await fetch('/api/get-submissions', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
        setIsAuthenticated(true);
        
        // Save credentials to localStorage (not secure, but ok for demo)
        localStorage.setItem('admin_credentials', credentials);
      } else {
        const error = await response.json();
        setError(error.error || '身份驗證失敗');
      }
    } catch (err) {
      setError('獲取提交數據時出現錯誤');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Check if there are saved credentials
    const savedCredentials = localStorage.getItem('admin_credentials');
    
    if (savedCredentials) {
      // Try to authenticate with saved credentials
      (async () => {
        try {
          const response = await fetch('/api/get-submissions', {
            headers: {
              'Authorization': `Basic ${savedCredentials}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setSubmissions(data.submissions || []);
            setIsAuthenticated(true);
          } else {
            // Clear invalid credentials
            localStorage.removeItem('admin_credentials');
          }
        } catch (err) {
          console.error('Error with saved credentials:', err);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, []);
  
  // In development, we'll also get submissions from localStorage for testing
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isAuthenticated) {
      try {
        // Try to get submissions from localStorage (used in dev mode)
        const photoGridData = localStorage.getItem('photoGridData');
        if (photoGridData) {
          const parsedData = JSON.parse(photoGridData);
          if (parsedData && parsedData.photos) {
            setSubmissions([
              {
                id: 'local_submission_' + Date.now(),
                timestamp: new Date().toISOString(),
                photosCount: parsedData.photos.length,
                photos: parsedData.photos,
                source: 'localStorage'
              }
            ]);
          }
        }
      } catch (err) {
        console.error('Error getting submissions from localStorage:', err);
      }
    }
  }, [isAuthenticated]);
  
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_credentials');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg">載入中...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">管理員登入</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                用戶名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                密碼
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              登入
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">照片提交數據</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            登出
          </button>
        </div>
        
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">目前還沒有照片提交。</p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-medium">提交 ID: {submission.id}</h2>
                    <p className="text-sm text-gray-500">
                      提交時間: {new Date(submission.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      照片數量: {submission.photosCount || '未知'}
                    </p>
                  </div>
                </div>
                
                {submission.photos && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium mb-3">照片預覽:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {submission.photos.map((photo) => (
                        <div key={photo.id} className="aspect-square bg-gray-100 overflow-hidden rounded-md">
                          <img 
                            src={photo.croppedPreview || photo.preview} 
                            alt={photo.name || 'Unnamed photo'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {submission.photoOrder && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium mb-2">照片順序:</h3>
                    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <pre className="text-xs overflow-auto">{JSON.stringify(submission.photoOrder, null, 2)}</pre>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">完整數據:</h3>
                  <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                    <pre className="text-xs overflow-auto">{JSON.stringify(submission, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage; 