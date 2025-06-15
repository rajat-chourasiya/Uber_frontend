import React from 'react'
import car from '../assets/lux.png'
import driver from '../assets/rajat_pic.png'

const vehicleImages = {
  car: car,
  moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
  auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
}

const vehicleNames = {
  car: "Maruti Suzuki Alto",
  moto: "Bajaj Pulsar",
  auto: "Bajaj RE",
}

const WaitingForDriver = (props) => {
  const imgSrc = vehicleImages[props.vehicleType] || vehicleImages.car;
  const vehicleName = vehicleNames[props.vehicleType] || "Vehicle";
  const driverName = props.ride?.captain.fullname.firstname || "Driver";
  const driverRating = props.ride?.captain.rating || 4.5;

  return (
    <div>
      {/* Close Button */}
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => props.waitingForDriver(false)}>
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      {/* OTP */}
      <div className="absolute top-3 right-4 bg-yellow-400 text-black font-semibold px-3 py-1 rounded-full shadow text-sm">
        OTP: {props.ride?.otp}
      </div>

      {/* Heading */}
      <h3 className='lg:text-2xl font-semibold mb-2 mt-1 text-center'>✅ Your ride has arrived</h3>

     {/* Driver & Vehicle Section */}
<div className='flex items-stretch justify-between px-3 sm:px-5 mb-5 flex-col sm:flex-row gap-3'>

  {/* Driver Info Box */}
  <div className='flex flex-col items-center justify-center bg-white/10 border border-white/20 shadow-md p-4 rounded-xl w-full sm:max-w-[45%] transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-lg min-h-[100px]'>
    <div className='flex gap-4 items-center'>
      {/* Image + rating */}
      <div className='flex flex-col items-center'>
        <img
          src={driver}
          alt="Driver"
          className="lg:w-20 lg:h-20 w-15 h-12 rounded-full object-cover border-2 border-white shadow"
        />
        <div className='flex  items-center mt-1 pr-2 text-yellow-400'>
          <i className="ri-star-fill mr-1  text-sm"></i>
          <span className='text-gray-800 text-[13px] font-semibold'>{driverRating}</span>
        </div>
      </div>

      {/* Name + phone */}
      <div className='flex flex-col justify-center'>
        <p className='text-sm font-medium capitalize'>{driverName}</p>
        <p className='text-sm text-gray-500 select-text'><i className="ri-phone-fill"></i> +91 9876543210</p>
      </div>
    </div>
  </div>

  {/* Vehicle Info Box */}
  <div className='flex flex-col items-center bg-white/10 border border-white/20 shadow-md p-4 rounded-xl w-full sm:max-w-[45%] transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-lg'>
    <img className='h-10 lg:h-16 w-auto mb-2 mx-auto' src={imgSrc} alt={props.vehicleType} />
    <h4 className='text-sm lg:text-lg font-semibold'>{props.ride?.captain.vehicle.plate}</h4>
    <p className='text-sm text-gray-500'>{vehicleName}</p>
  </div>

</div>







      {/* Ride Route & Fare */}
<div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">

  {/* From and To side by side */}
  <div className="flex gap-4 flex-nowrap justify-evenly">

    {/* From */}
    <div className="flex flex-col justify-center items-center lg:gap-2 gap-1 p-2 border rounded-md border-gray-300 hover:shadow-[0_0_8px_2px_rgba(59,130,246,0.5)] transition-shadow duration-300 cursor-default flex-grow min-w-[40%] max-w-[45%] text-center overflow-hidden">
      <div className="flex items-center justify-center lg:gap-2 gap-1">
        <i className="ri-map-pin-user-fill text-blue-600 lg:text-xl"></i>
        <h3 className="lg:text-lg font-semibold">From</h3>
      </div>
      <p 
        className="text-base text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden max-w-full"
        title={props.ride?.pickup} // optional: shows full on hover
      >
        {props.ride?.pickup}
      </p>
    </div>

    {/* To */}
    <div className="flex flex-col justify-center items-center lg:gap-2 gap-1 p-2 border rounded-md border-gray-300 hover:shadow-[0_0_8px_2px_rgba(34,197,94,0.5)] transition-shadow duration-300 cursor-default flex-grow min-w-[40%] max-w-[45%] text-center overflow-hidden">
      <div className="flex items-center justify-center lg:gap-2 gap-1">
        <i className="ri-map-pin-2-fill text-green-600 lg:text-xl"></i>
        <h3 className="lg:text-lg font-semibold">To</h3>
      </div>
      <p 
        className="text-base text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden max-w-full"
        title={props.ride?.destination} // optional: shows full on hover
      >
        {props.ride?.destination}
      </p>
    </div>

  </div>

  {/* Fare */}
  <div className="flex flex-col justify-center items-center lg:gap-2 gap-1 p-2 border rounded-md border-gray-300 hover:shadow-[0_0_8px_2px_rgba(202,138,4,0.5)] transition-shadow duration-300 cursor-default text-center">
    <div className="flex items-center justify-center lg:gap-2 gap-1">
      <i className="ri-currency-line text-yellow-600 lg:text-2xl text-lg"></i>
      <h3 className="lg:text-lg font-semibold">₹{props.ride?.fare}</h3>
    </div>
    <p className="text-base text-gray-600">Cash</p>
  </div>

  {/* Cancel Ride Button */}
  <div className="flex justify-center">
    <button
      onClick={() => props.cancelRide && props.cancelRide()}
      className="mt-1 w-full max-w-xs bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-3 rounded-md shadow-md transition-colors duration-300"
    >
      Cancel Ride
    </button>
  </div>

</div>







    </div>
  )
}

export default WaitingForDriver;
