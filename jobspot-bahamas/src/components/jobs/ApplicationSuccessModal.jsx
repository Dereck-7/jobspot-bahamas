import { Check } from 'lucide-react';

export default function ApplicationSuccessModal({ isOpen, onClose, jobTitle, companyName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full m-4 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Application Submitted Successfully!
        </h3>
        
        <p className="text-sm text-gray-500 mb-4">
          Your application for {jobTitle} at {companyName} has been submitted. 
          We'll notify you when the employer reviews your application.
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Next steps:
          </p>
          <ul className="text-sm text-gray-600 text-left list-disc pl-5 space-y-2">
            <li>Review your application status in your dashboard</li>
            <li>Keep your profile up to date</li>
            <li>Be prepared for potential contact from {companyName}</li>
            <li>Continue exploring other opportunities on JobSpot</li>
          </ul>
        </div>

        <div className="mt-6 space-x-4">
          <button
            onClick={() => window.location.href = '/dashboard/applications'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-bahamas-aqua hover:bg-opacity-90"
          >
            View Applications
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
