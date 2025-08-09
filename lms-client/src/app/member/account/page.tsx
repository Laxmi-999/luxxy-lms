'use client';
import React from 'react';
import { useSelector } from 'react-redux';

const Account = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const handleChangePassword = () => {
    // Placeholder for change password functionality
    alert('Change password functionality to be implemented');
  };

  return (
    <div className="w-7xl mx-auto bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl my-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">My Account</h2>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="w-24 h-24 rounded-full bg-orange-200 flex items-center justify-center text-4xl font-bold text-orange-600 mx-auto mb-4">
              {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">{userInfo?.name || 'User'}</h3>
            <p className="text-gray-600">{userInfo?.role || 'Member'}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={userInfo?.name || ''}
            readOnly
            className="w-full p-3 border border-gray-200 text-gray-800 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={userInfo?.email || ''}
            readOnly
            className="w-full p-3 border border-gray-200 text-gray-800 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <input
            type="text"
            value={userInfo?.role || ''}
            readOnly
            className="w-full p-3 border border-gray-200 text-gray-800 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="w-full py-3 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Account;