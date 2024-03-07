import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

interface LocationData {
  urn_id: string;
  distance: string | number;
  jobtitle: string | null;
  location: string;
  name: string;
  latitude: number; // Add latitude property
  longitude: number; // Add longitude property
}

const MapComponent: React.FC = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);

  const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

  useEffect(() => {
    // Load location data from JSON file (replace with your actual data source)
    const fetchLocations = async () => {
      try {
        // Fetch your data here (e.g., from an API or local JSON file)
        // Example: const response = await fetch('/api/locations');
        // const data: LocationData[] = await response.json();
        // setLocations(data);

        // For demonstration purposes, using static data
        const staticData: LocationData[] = [
          {
            urn_id: '1',
            distance: 10,
            jobtitle: 'Engineer',
            location: 'Sample Location',
            name: 'John Doe',
            latitude: 22.3053263,
            longitude: 70.8028377,
          },
          // Add more location entries as needed
        ];
        setLocations(staticData);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />
            ))
          }
        </Geographies>
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinates={[location.longitude, location.latitude]} // Swap longitude and latitude
          >
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
