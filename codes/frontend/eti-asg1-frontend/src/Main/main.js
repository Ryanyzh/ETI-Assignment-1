// Import necessary modules and components
import React from 'react';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import DisplayUpdatePassengerAccount from '../components/updatePassengerAccount';
import DisplayUpdateCarOwnerAccount from '../components/updateCarOwnerAccount';
import DisplayDeleteAccount from '../components/deleteAccount';
import DisplayViewAvailableTrips from '../components/viewAvailableTrips';
import DisplayViewCompletedTrips from '../components/viewCompletedTrips';
import DisplayPublishTrip from '../components/publishNewTrip';
import DisplayViewBookedTripsForPassenger from '../components/viewBookedTripsForPassenger';
import DisplayViewBookedTripsForCarOwner from '../components/viewBookedTripsForCarOwner';
import DisplayViewStartedTrips from '../components/viewStartedTrips';

function MainPage() {
    // State to store user type
    const [role, setRole] = useState(localStorage.getItem('userType')); // ['passenger', 'car-owner']
    const [firstName, setFirstName] = useState(localStorage.getItem('firstName'));
    const [content, setContent] = useState(null); 
    const [userData, setUserData] = useState(null); // State to store user data
    const navigate = useNavigate();

    
    // Add functions to the corresponding buttons when clicked
    function displayUpdatePassengerAccount () {
        setContent(<DisplayUpdatePassengerAccount />);
    }

    function displayUpdateCarOwnerAccount () {
        setContent (<DisplayUpdateCarOwnerAccount />)
    }

    function displayDeleteAccount () { 
        setContent (<DisplayDeleteAccount />);
    }

    function displayViewAvailableTrips () {
        setContent (<DisplayViewAvailableTrips />)
    }

    function displayViewCompletedTrips () {
        setContent (<DisplayViewCompletedTrips />)
    }

    function displayPublishTrip () {
        setContent (<DisplayPublishTrip />)
    }

    function displayViewBookedTripsForCarOwner () {
        setContent (<DisplayViewBookedTripsForCarOwner />)
    }

    function displayViewBookedTripsForPassenger () {
        setContent (<DisplayViewBookedTripsForPassenger />)
    }

    function displayViewStartedTrips () {
        setContent (<DisplayViewStartedTrips />)
    }

    // handle logout (clear local storage and redirect to login page)
    function handleLogout () {
        localStorage.clear();
        window.location.reload();
    }


    // Display the corresponding content (buttons) based on the user type
    return (
        <div className="w-full h-full flex flex-col bg-white px-14 py-5">
            <div className="mt-10 font-montserrat text-left text-4xl font-bold leading-9 tracking-tight text-black">
                Welcome 
                <span className='text-red'> {firstName}</span>
                ,
            </div>

            <div className='w-full h-fit'>
                {role === 'passenger' ? (
                    <div className='mt-10 w-full h-auto md:grid md:grid-cols-3 md:gap-x-5 lg:grid-cols-6 lg:gap-x-7 gap-y-5'>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayUpdatePassengerAccount}
                            >
                            UPDATE ACCOUNT
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayDeleteAccount}
                            >
                            DELETE ACCOUNT
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={handleLogout}
                            >
                            LOGOUT
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayViewAvailableTrips}
                            >
                            VIEW AVAILABLE TRIPS
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayViewBookedTripsForPassenger}
                            >
                            VIEW BOOKED TRIPS
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayViewCompletedTrips}
                            >
                            VIEW COMPLETED TRIPS
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='mt-10 w-full h-auto md:grid md:grid-cols-3 md:gap-x-5 lg:grid-cols-6 lg:gap-x-7 gap-y-5'>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayUpdateCarOwnerAccount}
                            >
                            UPDATE ACCOUNT
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayDeleteAccount}
                            >
                            DELETE ACCOUNT
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={handleLogout}
                            >
                            LOGOUT
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayPublishTrip}
                            >
                            PUBLISH TRIPS
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayViewBookedTripsForCarOwner}
                            >
                            VIEW BOOKED TRIPS
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={displayViewStartedTrips}
                            >
                            VIEW STARTED TRIPS
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex w-full flex-col items-start mt-12 overflow-y-auto">
                <div className='w-full bg-light-gray rounded-lg px-16 py-10 border-2 border-black font-rubik'>
                    {/* insert the corresponding content here */}
                    {content}
                </div>
            </div>
        </div>
    );
}

export default MainPage;
