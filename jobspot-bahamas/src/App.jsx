import { useState, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import JobSearch from './components/jobs/JobSearch';
import JobList from './components/jobs/JobList';
import MapView from './components/map/MapView';
import JobFilters from './components/jobs/JobFilters';
import { LoginModal } from './components/auth/LoginModal';
import { SignupModal } from './components/auth/SignupModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import { sampleJobs } from './data/sampleJobs';
import UserProfile from './components/user/UserProfile';
import PostJobModal from './components/jobs/PostJobModal';
import FirebaseErrorBoundary from './components/common/FirebaseErrorBoundary';
import { checkFirebaseServices } from './utils/firebaseChecker';

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  
  const [filters, setFilters] = useState({
    location: 'All Locations',
    category: 'All Categories',
    jobType: 'All Types',
    minSalary: '',
    maxSalary: ''
  });

  const filteredJobs = useMemo(() => {
    return sampleJobs.filter(job => {
      // Search term filter
      if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !job.company.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Location filter
      if (filters.location !== 'All Locations' && job.location !== filters.location) {
        return false;
      }

      // Category filter
      if (filters.category !== 'All Categories' && job.category !== filters.category) {
        return false;
      }

      // Job type filter
      if (filters.jobType !== 'All Types' && job.jobType !== filters.jobType) {
        return false;
      }

      // Salary range filter
      if (filters.minSalary && job.salary < parseInt(filters.minSalary) * 1000) {
        return false;
      }
      if (filters.maxSalary && job.salary > parseInt(filters.maxSalary) * 1000) {
        return false;
      }

      return true;
    });
  }, [searchTerm, filters]);

  useEffect(() => {
    const checkServices = async () => {
        try {
            await checkFirebaseServices();
        } catch (error) {
            console.error('Service check failed:', error);
        }
    };
    
    checkServices();
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId)
  }

  return (
    <FirebaseErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onLoginClick={() => setIsLoginOpen(true)}
          onSignupClick={() => setIsSignupOpen(true)}
          onLogoutClick={handleLogout}
          onProfileClick={() => setIsProfileOpen(true)}
          onPostJobClick={() => setIsPostJobOpen(true)}
          user={currentUser}
        />
        
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <JobSearch 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            onOpenFilters={() => setIsFiltersOpen(true)}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <JobList 
              jobs={filteredJobs} 
              selectedJobId={selectedJobId}
              onJobSelect={handleJobSelect}
            />
            <ErrorBoundary>
              <MapView 
                jobs={filteredJobs}
                selectedJobId={selectedJobId}
                onJobSelect={handleJobSelect}
              />
            </ErrorBoundary>
          </div>
        </main>

        <JobFilters
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          filters={filters}
          setFilters={setFilters}
        />

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToSignup={() => {
            setIsLoginOpen(false);
            setIsSignupOpen(true);
          }}
        />

        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          onSwitchToLogin={() => {
            setIsSignupOpen(false);
            setIsLoginOpen(true);
          }}
        />

        <UserProfile
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />

        <PostJobModal
          isOpen={isPostJobOpen}
          onClose={() => setIsPostJobOpen(false)}
        />
      </div>
    </FirebaseErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
