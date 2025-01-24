import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useJobApplication } from './useJobApplication';
import { uploadFile, validateFile } from '../utils/fileUpload';

export function useApplicationForm(job) {
  const { currentUser } = useAuth();
  const { applyToJob } = useJobApplication();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeFile: null,
    phoneNumber: currentUser?.phoneNumber || '',
    availableStartDate: '',
    salary: {
      expectation: '',
      currency: 'BSD'
    },
    workAuthorization: 'Yes',
    referralSource: '',
    linkedinProfile: ''
  });

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (formData.resumeFile && !validateFile(formData.resumeFile)) {
        throw new Error('Invalid file type or size');
      }

      // Upload resume if provided
      let resumeUrl = null;
      if (formData.resumeFile) {
        resumeUrl = await uploadFile(formData.resumeFile, 'resumes');
      }

      // Submit application
      await applyToJob(job.id, {
        ...formData,
        resumeUrl,
        status: 'Applied',
        appliedAt: new Date().toISOString()
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [formData, job.id, applyToJob]);

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const validateForm = useCallback(() => {
    const validations = {
      coverLetter: formData.coverLetter.length >= 100,
      resumeFile: formData.resumeFile !== null,
      phoneNumber: /^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)
    };

    return {
      isValid: Object.values(validations).every(Boolean),
      validations
    };
  }, [formData]);

  return {
    formData,
    updateFormData,
    handleSubmit,
    validateForm,
    loading,
    error,
    success,
    setSuccess
  };
}

// Add form field types for better type checking
export const FORM_FIELDS = {
  COVER_LETTER: 'coverLetter',
  RESUME_FILE: 'resumeFile',
  PHONE_NUMBER: 'phoneNumber',
  AVAILABLE_START_DATE: 'availableStartDate',
  SALARY_EXPECTATION: 'salary.expectation',
  WORK_AUTHORIZATION: 'workAuthorization',
  REFERRAL_SOURCE: 'referralSource',
  LINKEDIN_PROFILE: 'linkedinProfile'
};
