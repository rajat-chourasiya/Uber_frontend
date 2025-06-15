import React from 'react'
import gif from '../assets/gif.gif'
import { GiPathDistance } from "react-icons/gi";

const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
}
const LookingForDriver = (props) => {
    const imgSrc = vehicleImages[props.vehicleType] || vehicleImages.car;
    return (
        <div>
            <h5 className='p-3 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehicleFound(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <div className="flex items-center gap-0 mb-1 ">
                <h3 className="text-2xl font-semibold mb-1 ">
                    Looking for a Driver
                </h3>
                <img
                    src={gif}
                    alt="loading animation"
                    className="w-15 h-6 mb-2 object-contain"
                />
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src={imgSrc} alt={props.vehicleType} />
                <div className='w-full mt-0'>
                    <div className='flex items-center gap-5 p-2 border-b-2'>
                        <i className="ri-map-pin-user-fill text-blue-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>From</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-2 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-green-600"></i>
                        <div>
                            <p className="absolute right-4 text-sm font-medium  whitespace-nowrap text-black rounded-full shadow px-1 py-[2px] flex items-center gap-1 bg-[#ffeee5]">
                                <GiPathDistance />
                                {props.distance}
                               {props.duration && ` (${props.duration})`}
                            </p>
                            <h3 className='text-lg font-medium'>To</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-yellow-600"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.fare[props.vehicleType]} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver