import { Search, Filter } from 'lucide-react'

export default function JobSearch({ searchTerm, setSearchTerm, onOpenFilters }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search jobs in Nassau..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bahamas-aqua focus:outline-none transition-shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button 
        onClick={onOpenFilters}
        className="px-4 py-2 rounded-lg flex items-center gap-2 text-white bg-bahamas-gold hover:bg-opacity-90 transition-colors"
      >
        <Filter size={20} />
        Filters
      </button>
    </div>
  )
}
