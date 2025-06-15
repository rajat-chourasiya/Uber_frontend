import React, { useState, useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import driver from '../assets/rajat_pic.png'

const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const { user } = useContext(UserDataContext);
    const location = useLocation();
    const rideId = location.state?.rideId;
    const navigate = useNavigate();

    const tags = [
        'Professionalism',
        'Driving',
        'Cleanliness',
        'Conversation',
        'Pickup',
        'Driver navigation',
        'Uber app',
        'Car quality',
        'Other',
    ];

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        if (!rating) {
            toast.error('Please select a rating.');
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/feedback`,
                {
                    rideId,
                    captainId: user?._id,
                    rating,
                    comment: selectedTags.join(', '), // Tags sent as comment
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            toast.success('Thank you for your feedback!');
            setSubmitted(true);
            localStorage.removeItem('user');
            setTimeout(() => navigate('/login'), 2500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                <h2 className="text-3xl font-bold mb-4 text-green-600">🎉 Thanks for your feedback!</h2>
                <p className="text-gray-600 text-lg">We appreciate you taking the time to help us improve.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-800">
                Thank you for riding with us!
            </h2>
            <p className="text-gray-500 mb-8">We'd love to hear how your experience was.</p>

            <img
                src={driver}
                alt="Driver"
                className="w-24 h-24 rounded-full border-4 border-gray-300 mb-4"
            />

            <div className="flex space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        onClick={() => setRating(num)}
                        onMouseEnter={() => setHover(num)}
                        onMouseLeave={() => setHover(0)}
                        className={`text-4xl transition ${
                            (hover || rating) >= num ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <p className="text-sm text-gray-500 mb-2">
                {rating < 5 && rating > 0 ? 'OK, but had an issue' : ''}
            </p>

            {rating < 5 && rating > 0 && (
                <div className="flex flex-wrap gap-2 max-w-md mb-4 justify-center">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 rounded-full border ${
                                selectedTags.includes(tag)
                                    ? 'bg-red-500 border-red-700 text-white'
                                    : 'bg-white text-gray-600 border-gray-300'
                            } text-sm`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!rating}
                className={`w-full max-w-md bg-black text-white px-6 py-3 mt-4 rounded font-medium hover:bg-green-600 transition ${
                    !rating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                Submit Feedback
            </button>
        </div>
    );
};

export default Feedback;
