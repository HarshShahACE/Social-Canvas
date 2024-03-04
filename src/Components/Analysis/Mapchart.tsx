// MapComponent.tsx
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

interface LocationData {
  location: string;
  // Add other data properties here as needed
}

const MapComponent: React.FC = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    // Load location data from JSON file
    const fetchLocations = async () => {
      try {
        const response = await fetch('url(../../assets/UserJSON/profileConnection1.json)');
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        const data: LocationData[] = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
        <Geographies geography="geojson/world-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />
            ))
          }
        </Geographies>
        {locations.map((location, index) => (
          <Marker key={index} coordinates={[Math.random() * 360 - 180, Math.random() * 180 - 90]}>
            <circle r={3} fill="#F00" />
            <text x="-6" y="6" fontSize="10px" fill="#5D5A6D">
              {location.location}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default MapComponent;
