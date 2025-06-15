import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { loadGoMapsScript } from '../utils/loadGoMaps.js';  

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    loadGoMapsScript()
      .then(() => setMapReady(true))
      .catch((err) => {
        console.error('Failed to load GoMaps.pro script:', err);
      });
  }, []);

  useEffect(() => {
    if (!mapReady) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
    });

    const watchId = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [mapReady]);

  if (!mapReady) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentPosition}
      zoom={15}
    >
      <Marker position={currentPosition} />
    </GoogleMap>
  );
};

export default LiveTracking;
