import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminIndex = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-2xl font-bold mb-6">管理控制台</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/pages/admin/submissions')}
          >
            <h2 className="text-xl font-medium mb-2">照片提交數據</h2>
            <p className="text-gray-600">查看所有使用者提交的照片排列</p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                查看提交
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium mb-2">系統狀態</h2>
            <p className="text-gray-600">查看系統運行狀態和使用統計</p>
            <div className="mt-4">
              <div className="text-green-500 font-medium">● 運行正常</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIndex; 