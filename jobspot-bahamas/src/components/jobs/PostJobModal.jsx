import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FirebaseService from '../../services/firebase';
import { X } from 'lucide-react';

export default function PostJobModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    category: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    salary: {
      min: '',
      max: '',
      currency: 'BSD'
    },
    benefits: [''],
    remote: false,
    experience: {
      min: 0,
      max: 5
    },
    education: 'Bachelor\'s Degree'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await FirebaseService.createJob({
        ...formData,
        userId: currentUser.uid,
        status: 'Active',
        createdAt: new Date().toISOString()
      });
      onClose();
    } catch (err) {
      setError('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-bahamas-black">Post a Job</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Job Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title*
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-bahamas-aqua focus:border-transparent"
              />
            </div>
            {/* Add other form fields... */}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-bahamas-aqua text-white rounded-lg hover:bg-opacity-90"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
