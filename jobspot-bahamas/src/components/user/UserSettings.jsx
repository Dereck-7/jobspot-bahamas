import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, Camera, Mail, Shield, Bell, User, LogOut } from 'lucide-react';

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg w-full ${
      active 
        ? 'bg-bahamas-aqua text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const Toggle = ({ enabled, onToggle, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <h4 className="text-sm font-medium text-gray-900">{label}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bahamas-aqua ${
        enabled ? 'bg-bahamas-aqua' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default function UserSettings({ isOpen, onClose }) {
  // ...existing state declarations...

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-bahamas-black">Account Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            <TabButton
              active={activeTab === 'profile'}
              icon={User}
              label="Profile"
              onClick={() => setActiveTab('profile')}
            />
            // ...existing tab buttons...
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                // ...existing profile form fields...
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Experience
                  </label>
                  <textarea
                    className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-bahamas-aqua focus:border-transparent"
                    rows={4}
                    value={profileData.experience}
                    onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                    placeholder="Describe your work experience..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-bahamas-aqua text-white rounded-lg hover:bg-opacity-90"
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'account' && (
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                // ...existing account form fields...
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>

                <div className="space-y-4">
                  {/* Email Notifications */}
                  <Toggle
                    enabled={emailNotifications}
                    onToggle={() => setEmailNotifications(!emailNotifications)}
                    label="Email Notifications"
                    description="Receive email notifications for important updates."
                  />

                  {/* Push Notifications */}
                  <Toggle
                    enabled={pushNotifications}
                    onToggle={() => setPushNotifications(!pushNotifications)}
                    label="Push Notifications"
                    description="Receive push notifications for important updates."
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleProfileSubmit}
                      disabled={loading}
                      className="px-4 py-2 bg-bahamas-aqua text-white rounded-lg hover:bg-opacity-90"
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
