import { useState, useEffect } from 'react';
import { jobsApi } from '../../services/api';
import { MapPin, Briefcase, DollarSign } from 'lucide-react';
import PropTypes from 'prop-types';

function JobSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 bg-gray-200 rounded"></div>
            ))}
        </div>
    );
}

export default function JobList({ searchParams, onJobSelect }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await jobsApi.getJobs({
                    page,
                    ...searchParams
                });
                setJobs(response.jobs);
                setTotalPages(response.pages);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load jobs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [page, searchParams]);

    if (loading) {
        return <div className="animate-pulse">Loading jobs...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-4">
            {jobs.map(job => (
                <div
                    key={job.id}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onJobSelect(job)}
                >
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center text-gray-500">
                            <MapPin size={16} className="mr-2" />
                            {job.location}
                        </div>
                        <div className="flex items-center text-gray-500">
                            <Briefcase size={16} className="mr-2" />
                            {job.job_type}
                        </div>
                        {(job.salary_min || job.salary_max) && (
                            <div className="flex items-center text-gray-500">
                                <DollarSign size={16} className="mr-2" />
                                {job.salary_min && job.salary_max 
                                    ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                                    : job.salary_min 
                                    ? `From $${job.salary_min.toLocaleString()}`
                                    : `Up to $${job.salary_max.toLocaleString()}`
                                }
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

JobList.propTypes = {
    searchParams: PropTypes.object,
    onJobSelect: PropTypes.func.isRequired
};
