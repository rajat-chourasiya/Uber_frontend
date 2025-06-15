import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { DistanceContext } from '../context/DistanceContext.jsx';
import { GiPathDistance } from "react-icons/gi";
import { useContext,useEffect} from 'react';

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('')
    const navigate = useNavigate()


    const { fetchDistance,  duration, distance } = useContext(DistanceContext);
        useEffect(() => {
            if (props.ride?.pickup && props.ride?.destination) {
                fetchDistance(props.ride?.pickup, props.ride?.destination);
            }
        }, [props.ride?.pickup, props.ride?.destination]);


    const submitHander = async (e) => {
        e.preventDefault()

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }

        
    }
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5 mt-0'>Confirm this ride to Start</h3>
            <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4  '>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <h2 className='lg:text-lg   font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className='lg:text-lg font-semibold w-[50%] text-end'> {props.ride?.distance || '...'} ({props.ride?.duration || 'ETA unknown'})</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-10 lg:mt-10'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-blue-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>From</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-green-600"></i>
                        <div>
                            <p className="absolute right-4 text-sm font-medium  whitespace-nowrap text-black rounded-full shadow px-1 py-[2px] flex items-center gap-1 bg-[#ffeee5]">
                                <GiPathDistance />
                                {distance}
                                {duration && ` (${duration})`}
                            </p>
                            <h3 className='text-lg font-medium'>To</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-yellow-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>

                <div className='mt-7 w-full lg:mt-7'>
                    <form onSubmit={submitHander}>
                        <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" className='bg-[#eee] px-6 lg:py-4 py-3 font-mono text-lg rounded-lg w-full mt-3 lg:mt-3' placeholder='Enter OTP' />

                        <button className='w-full mt-6 lg:mt-6 text-lg flex justify-center bg-green-600 text-white font-semibold p-2.5 lg:p-3 rounded-lg'>Confirm</button>
                        <button onClick={() => {
                            props.setConfirmRidePopupPanel(false)
                            props.setRidePopupPanel(false)
                            { props.cancelRide }

                        }} className='w-full mt-3 bg-red-600 text-lg text-white font-semibold p-2.5 lg:p-3 rounded-lg'>Cancel</button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp