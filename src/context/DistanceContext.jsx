import axios from 'axios';
import React, { createContext, useState } from 'react';

export const DistanceContext = createContext();

export const DistanceProvider = ({ children }) => {
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null); 

  const fetchDistance = async (pickup, destination) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-distance`, {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${token}` },
      });
      setDistance(response.data.distance);
      setDuration(response.data.duration);

    } catch (err) {
      console.error('Error fetching distance:', err);
    }
  };

  return (
    <DistanceContext.Provider value={{ distance, duration, fetchDistance }}>
      {children}
    </DistanceContext.Provider>
  );
};
