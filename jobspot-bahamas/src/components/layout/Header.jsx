import { useState } from 'react';
import { MapPin, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserSettings from '../user/UserSettings';

export default function Header({ onLoginClick, onSignupClick, onPostJobClick }) {
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b-4 border-bahamas-gold">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin size={24} className="text-bahamas-aqua" />
            <h1 className="ml-2 text-2xl font-bold text-bahamas-black">
              JobSpot Bahamas
            </h1>
          </div>

          {/* Auth section */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <button
                  onClick={onPostJobClick}
                  className="px-4 py-2 rounded-lg font-medium text-white bg-bahamas-aqua hover:bg-opacity-90 transition-colors"
                >
                  Post a Job
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-bahamas-aqua flex items-center justify-center">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>
                    <span className="text-gray-700">{currentUser.displayName || 'User'}</span>
                    <ChevronDown size={16} className="text-gray-600" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowSettings(true);
                            setShowUserMenu(false);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings size={16} />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut size={16} />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 rounded-lg font-medium text-bahamas-aqua border border-bahamas-aqua hover:bg-bahamas-aqua hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-4 py-2 rounded-lg font-medium text-white bg-bahamas-black hover:bg-opacity-90 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <UserSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </header>
  );
}
