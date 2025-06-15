import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import { FaLocationCrosshairs } from "react-icons/fa6";


const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [distance, setDistance] = useState(null)
    const [duration, setDuration] = useState(null); 


    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    const detectCurrentLocation = () => {
        setDetectingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/reverse-geocode`, {
                        params: {
                            lat: latitude,
                            lng: longitude
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    setPickup(response.data.address);
                } catch (err) {
                    console.error("Error reverse geocoding location", err);
                    alert("Unable to detect your location.");
                } finally {
                    setDetectingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Please allow location access to detect your current location.");
                setDetectingLocation(false);
            }
        );
    };


    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [user])

    useEffect(() => {
        if (!pickup) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/reverse-geocode`, {
                            params: { lat: latitude, lng: longitude },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });

                        if (response.data && response.data.address) {
                            setPickup(response.data.address); // Set the address in the pickup field
                        }
                    } catch (error) {
                        console.error("Reverse geocoding failed:", error);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    }, []);

    socket.on('ride-confirmed', ride => {


        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })


    const handlePickupChange = async (e) => {
        const input = e.target.value;
        setPickup(input);

        // Only fetch suggestions if panel is open and input is valid
        if (panelOpen && input.length >= 3 && activeField === 'pickup') {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params: { input },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPickupSuggestions(response.data);
            } catch (err) {
                console.error("Error fetching pickup suggestions", err);
            }
        }
    };

    const handleDestinationChange = async (e) => {
        const input = e.target.value;
        setDestination(input);

        // Only fetch suggestions if panel is open and input is valid
        if (panelOpen && input.length >= 3 && activeField === 'destination') {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params: { input },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDestinationSuggestions(response.data);
            } catch (err) {
                console.error("Error fetching destination suggestions", err);
            }
        }
    };


    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePanel])



    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehicleFound])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriver])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


        setFare(response.data)



    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


    }

    async function fetchDistance(pickup, destination) {
        try {
             const token = localStorage.getItem('token');

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-distance`, {
                params: { pickup, destination },
                headers: {
                   Authorization: `Bearer ${localStorage.getItem('token')}` // replace with your auth token
                },
            });

            console.log('Distance:', response.data.distance);
          //  console.log('Duration:', response.data.duration);

            // Store in state if needed
            setDistance(response.data.distance);
            setDuration(response.data.duration);
        } catch (error) {
            console.error('Error fetching distance:', error);
        }
    }

      useEffect(() => {
    if (pickup && destination) {
      fetchDistance(pickup, destination);
    }
  }, [pickup, destination]);


    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            <div className='h-screen w-screen'>
                {/* image for temporary use  */}
                <LiveTracking />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6  pt-12 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-2xl font-semibold">Find a trip</h4>
                        <button
                            onClick={detectCurrentLocation}
                            disabled={detectingLocation}
                            className="pt-2 flex items-center gap-2 text-blue-600 text-sm lg:text-base hover:text-red-700 whitespace-nowrap"
                        >
                            <FaLocationCrosshairs className="text-base" />
                            {detectingLocation ? 'Detecting...' : 'Use My location'}
                        </button>
                    </div>

                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />





                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0 '>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 '>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    distance={distance}
                    duration={duration}
                    setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>

            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    distance={distance}
                    vehicleType={vehicleType}
                    duration={duration}
                    setVehicleFound={setVehicleFound} />
            </div>

            {waitingForDriver && (
                <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                    <WaitingForDriver
                        ride={ride}
                        vehicleType={vehicleType}
                        setVehicleFound={setVehicleFound}
                        setWaitingForDriver={setWaitingForDriver}
                        cancelRide={() => {
                            setConfirmRidePanel(false);   // closes ConfirmRidePopUp
                            setVehiclePanel(false);          // closes WaitingForDriver
                            setWaitingForDriver(false);   // closes itself
                        }}
                        waitingForDriver={waitingForDriver} />
                </div>
            )}
        </div>
    )
}

export default Home