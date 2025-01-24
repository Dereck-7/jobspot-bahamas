import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobApplication } from '../../hooks/useJobApplication';
import { uploadFile, validateFile } from '../../utils/fileUpload';
import { X, Upload, File, Loader } from 'lucide-react';
import ApplicationSuccessModal from './ApplicationSuccessModal';

export default function JobApplicationForm({ job, isOpen, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const { applyToJob, loading, error } = useJobApplication();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeFile: null,
    phoneNumber: currentUser?.phoneNumber || '',
    // ...existing initial state...
  });

  const [validation, setValidation] = useState({
    // ...existing validation state...
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    // ...existing validation logic...
  };

  const handleFileChange = (e) => {
    // ...existing file handling logic...
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // ...existing submission logic...
      setShowSuccess(true);
    } catch (error) {
      setError('Application submission failed');
    }
  };

  // Check for existing application
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (currentUser) {
        const applications = await FirebaseService.getUserApplications(currentUser.uid);
        const existingApplication = applications.find(app => app.jobId === job.id);
        if (existingApplication) {
          onClose();
          window.location.href = `/dashboard/applications/${existingApplication.id}`;
        }
      }
    };
    
    if (isOpen) {
      checkExistingApplication();
    }
  }, [isOpen, currentUser, job.id]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto z-50">
        <div className="bg-white rounded-lg p-8 max-w-3xl w-full m-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-bahamas-black">Apply for Position</h2>
              <p className="text-gray-600 mt-1">{job.title} at {job.company}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Upload Section */}
            <div>
              {/* ...existing resume upload JSX... */}
            </div>

            {/* Cover Letter Section */}
            <div>
              {/* ...existing cover letter JSX... */}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ...existing contact fields JSX... */}
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ...existing additional info JSX... */}
            </div>

            {/* Form Controls */}
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
                className="px-4 py-2 bg-bahamas-aqua text-white rounded-lg hover:bg-opacity-90 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ApplicationSuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        jobTitle={job.title}
        companyName={job.company}
      />
    </>
  );
}
