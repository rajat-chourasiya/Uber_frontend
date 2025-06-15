// src/components/CancelRideButton.jsx
import React, { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const CancelRideButton = ({ userId, captainId, onCancel }) => {
    const { socket } = useContext(SocketContext);

    const handleCancelRide = () => {
        if (!userId || !captainId) {
            console.warn('Missing userId or captainId');
            return;
        }

        socket.emit('cancel-ride', { userId, captainId });
        console.log('Ride cancel event sent');

        if (onCancel) onCancel(); // Optional UI change after cancel
    };

    return (
        <button
            onClick={handleCancelRide}
            className="mt-4 w-full max-w-xs bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-3 rounded-md shadow-md transition-colors duration-300"
        >
            Cancel Ride
        </button>
    );
};

export default CancelRideButton;
