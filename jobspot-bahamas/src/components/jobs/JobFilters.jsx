import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function JobFilters({ isOpen, onClose, filters, setFilters }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const locations = [
    'All Locations',
    'Downtown Nassau',
    'Paradise Island',
    'Cable Beach',
    'Western Nassau',
    'Eastern Nassau'
  ]

  const categories = [
    'All Categories',
    'Technology',
    'Finance',
    'Hospitality',
    'Healthcare',
    'Education',
    'Retail',
    'Tourism'
  ]

  const jobTypes = [
    'All Types',
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Remote'
  ]

  const handleReset = () => {
    setFilters({
      location: 'All Locations',
      category: 'All Categories',
      jobType: 'All Types',
      minSalary: '',
      maxSalary: ''
    })
  }

  // Backdrop for mobile
  const backdrop = (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
      aria-hidden="true"
    />
  )

  return (
    <>
      {backdrop}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-heading"
      >
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 id="filter-heading" className="text-xl font-semibold">Filters</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close filters"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-bahamas-aqua focus:border-transparent"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-bahamas-aqua focus:border-transparent"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-bahamas-aqua focus:border-transparent"
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (K/year)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 border-gray-300 rounded-lg focus:ring-2 focus:ring-bahamas-aqua focus:border-transparent"
                    value={filters.minSalary}
                    onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                    min="0"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 border-gray-300 rounded-lg focus:ring-2 focus:ring-bahamas-aqua focus:border-transparent"
                    value={filters.maxSalary}
                    onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                    min={filters.minSalary || "0"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-bahamas-aqua text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
