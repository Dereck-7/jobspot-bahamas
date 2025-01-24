import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FirebaseService from '../services/firebase';
import JobApplicationForm from '../components/jobs/JobApplicationForm';
import ApplicationSuccessModal from '../components/jobs/ApplicationSuccessModal';
import { MapPin, Building, Clock, Currency, Users, Calendar, Briefcase, GraduationCap, Globe } from 'lucide-react';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch job details
        const jobData = await FirebaseService.getJob(jobId);
        if (!jobData) {
          setError('Job not found');
          return;
        }
        setJob(jobData);

        // Check application status
        if (currentUser) {
          const applications = await FirebaseService.getUserApplications(currentUser.uid);
          setHasApplied(applications.some(app => app.jobId === jobId));
        }

        // Fetch similar jobs
        const similar = await FirebaseService.searchJobs({
          category: jobData.category,
          limit: 3,
          excludeJobId: jobId
        });
        setSimilarJobs(similar);

        // Track view
        await FirebaseService.trackJobView(jobId, currentUser?.uid);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, currentUser]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Building className="h-5 w-5 mr-2" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{job.type}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Currency className="h-5 w-5 mr-2" />
                  <span>
                    {job.salary.min && job.salary.max 
                      ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                      : 'Salary not specified'}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{job.applications} applications</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Content Sections */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Job Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc list-inside text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-700">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Apply Button */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {currentUser ? (
              hasApplied ? (
                <div className="text-center">
                  <p className="text-green-600 font-medium mb-2">
                    You&apos;ve already applied to this position
                  </p>
                  <button
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                    onClick={() => window.location.href = '/dashboard/applications'}
                  >
                    View Application
                  </button>
                </div>
              ) : (
                <button
                  className="w-full px-4 py-2 bg-bahamas-aqua text-white rounded-lg hover:bg-opacity-90"
                  onClick={() => setShowApplicationForm(true)}
                >
                  Apply Now
                </button>
              )
            ) : (
              <button
                className="w-full px-4 py-2 bg-bahamas-aqua text-white rounded-lg hover:bg-opacity-90"
                onClick={() => window.location.href = '/login?redirect=' + window.location.pathname}
              >
                Sign in to Apply
              </button>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Experience</p>
                  <p className="text-sm text-gray-500">
                    {job.experience.min}-{job.experience.max} years
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Education</p>
                  <p className="text-sm text-gray-500">{job.education}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Remote Work</p>
                  <p className="text-sm text-gray-500">
                    {job.remote ? 'Remote available' : 'On-site only'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Similar Jobs</h3>
              <div className="space-y-4">
                {similarJobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-bahamas-aqua transition-colors"
                  >
                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <JobApplicationForm
        job={job}
        isOpen={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        onSuccess={() => {
          setShowApplicationForm(false);
          setShowSuccessModal(true);
          setHasApplied(true);
        }}
      />

      <ApplicationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        jobTitle={job.title}
        companyName={job.company}
      />
    </div>
  );
}
