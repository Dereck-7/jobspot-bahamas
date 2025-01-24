import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FirebaseService from '../services/firebase';

/**
 * Custom hook for managing job applications
 */
export function useJobApplication() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyToJob = useCallback(async (jobId, applicationData) => {
    if (!currentUser) {
      throw new Error('You must be logged in to apply for jobs');
    }

    setLoading(true);
    setError(null);

    try {
      const application = {
        jobId,
        userId: currentUser.uid,
        ...applicationData,
        status: 'Applied',
        createdAt: new Date().toISOString()
      };

      const applicationId = await FirebaseService.createApplication(application);

      // Create notification for employer
      const job = await FirebaseService.getJob(jobId);
      await FirebaseService.createNotification(job.userId, {
        type: 'NEW_APPLICATION',
        title: 'New Job Application',
        message: `${currentUser.displayName || 'Someone'} has applied for ${job.title}`,
        data: {
          jobId,
          applicationId,
          applicantId: currentUser.uid
        }
      });

      return applicationId;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const getApplicationStatus = useCallback(async (jobId, applicationId) => {
    if (!currentUser) return null;

    try {
      const application = await FirebaseService.getApplication(jobId, applicationId);
      return application?.status || null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [currentUser]);

  const getUserApplications = useCallback(async () => {
    if (!currentUser) return [];

    setLoading(true);
    try {
      const applications = await FirebaseService.getUserApplications(currentUser.uid);
      return applications;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const withdrawApplication = useCallback(async (jobId, applicationId) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      await FirebaseService.updateApplication(jobId, applicationId, {
        status: 'Withdrawn',
        updatedAt: new Date().toISOString(),
        withdrawnAt: new Date().toISOString()
      });

      const job = await FirebaseService.getJob(jobId);
      await FirebaseService.createNotification(job.userId, {
        type: 'APPLICATION_WITHDRAWN',
        title: 'Application Withdrawn',
        message: `${currentUser.displayName || 'An applicant'} has withdrawn their application for ${job.title}`,
        data: { jobId, applicationId }
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const checkApplicationStatus = useCallback(async (jobId) => {
    if (!currentUser) return null;
    
    try {
      const applications = await FirebaseService.getUserApplications(currentUser.uid);
      return applications.find(app => app.jobId === jobId) || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [currentUser]);

  return {
    applyToJob,
    getApplicationStatus,
    getUserApplications,
    withdrawApplication,
    checkApplicationStatus,
    loading,
    error
  };
}

export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  REVIEWING: 'Reviewing',
  INTERVIEWING: 'Interviewing',
  REJECTED: 'Rejected',
  ACCEPTED: 'Accepted',
  WITHDRAWN: 'Withdrawn'
};
