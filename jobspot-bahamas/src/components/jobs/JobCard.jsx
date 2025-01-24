import { MapPin, Briefcase } from 'lucide-react'

export default function JobCard({ job, isSelected, onClick }) {
  return (
    <div 
      className={`border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-gray-50' : ''
      }`}
      onClick={() => onClick?.(job.id)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <MapPin size={16} className="mr-1" />
            {job.location}
          </div>
        </div>
        <Briefcase size={20} className="text-bahamas-aqua" />
      </div>
    </div>
  )
}
