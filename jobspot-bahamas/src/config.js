const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Remove custom styles to use Google's default styling
const MAP_STYLES = []

const MAP_OPTIONS = {
  styles: MAP_STYLES,
  disableDefaultUI: false, // Enable default UI
  zoomControl: true,
  mapTypeControl: true,    // Enable satellite/terrain toggle
  mapTypeControlOptions: {
    position: window?.google?.maps?.ControlPosition?.TOP_LEFT || 5,
    style: window?.google?.maps?.MapTypeControlStyle?.HORIZONTAL_BAR || 0,
    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
  },
  streetViewControl: true,  // Enable street view
  fullscreenControl: true
}

export { GOOGLE_MAPS_API_KEY, MAP_STYLES, MAP_OPTIONS }