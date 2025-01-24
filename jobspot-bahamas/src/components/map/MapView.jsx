import { useCallback, useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { GOOGLE_MAPS_API_KEY, MAP_OPTIONS } from '../../config'
import { createCustomMarkerIcon } from './CustomMarker'

const defaultCenter = {
  lat: 25.0443,  // Nassau coordinates
  lng: -77.3504
}

const containerStyle = {
  width: '100%',
  height: '100%'
}

export default function MapView({ jobs = [], selectedJobId = null, onJobSelect }) {
  const [map, setMap] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (selectedJobId) {
      const job = jobs.find(job => job.id === selectedJobId)
      if (job) {
        setSelectedMarker(job)
        map?.panTo(job.coordinates)
        map?.setZoom(14) // Zoom in when selecting a location
      }
    } else {
      setSelectedMarker(null)
    }
  }, [selectedJobId, jobs, map])

  const onLoad = useCallback(function callback(map) {
    if (jobs.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      jobs.forEach(job => bounds.extend(job.coordinates))
      map.fitBounds(bounds)
    }
    setMap(map)
  }, [jobs])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const handleMarkerClick = useCallback((job) => {
    setSelectedMarker(job)
    onJobSelect?.(job.id)
  }, [onJobSelect])

  const getMarkerAnimation = useCallback((isSelected) => {
    if (!isLoaded || !window.google) return null
    return isSelected 
      ? window.google.maps.Animation.BOUNCE 
      : window.google.maps.Animation.DROP
  }, [isLoaded])

  const getMarkerIcon = useCallback((isSelected) => {
    return isLoaded && window.google ? createCustomMarkerIcon(isSelected) : null
  }, [isLoaded])

  if (loadError) {
    return (
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 h-96">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500">Failed to load Google Maps</p>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 h-96">
      <LoadScript 
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        onLoad={() => setIsLoaded(true)}
        onError={(error) => setLoadError(error)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={MAP_OPTIONS}
        >
          {jobs.map((job) => (
            <Marker
              key={job.id}
              position={job.coordinates}
              onClick={() => handleMarkerClick(job)}
              animation={getMarkerAnimation(selectedJobId === job.id)}
              icon={getMarkerIcon(selectedJobId === job.id)}
            />
          ))}

          {selectedMarker && isLoaded && (
            <InfoWindow
              position={selectedMarker.coordinates}
              onCloseClick={() => {
                setSelectedMarker(null)
                onJobSelect?.(null)
              }}
            >
              <div className="p-2">
                <h3 className="font-medium text-bahamas-black">{selectedMarker.title}</h3>
                <p className="text-sm text-gray-600">{selectedMarker.company}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedMarker.location}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}