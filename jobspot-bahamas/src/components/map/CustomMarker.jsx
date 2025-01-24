export const createCustomMarkerIcon = (selected = false) => {
  // Create SVG marker as a data URL
  const svgMarker = `
    <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C8.96 0 0 8.96 0 20C0 35 20 48 20 48C20 48 40 35 40 20C40 8.96 31.04 0 20 0ZM20 28C15.58 28 12 24.42 12 20C12 15.58 15.58 12 20 12C24.42 12 28 15.58 28 20C28 24.42 24.42 28 20 28Z" 
            fill="${selected ? '#FFA400' : '#00ABC9'}"
      />
    </svg>
  `;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarker),
    scaledSize: new window.google.maps.Size(40, 48)
  };
}
