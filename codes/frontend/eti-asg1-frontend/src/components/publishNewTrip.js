import React from 'react';
import {useState, useEffect} from 'react';

export default function PublishNewTrip () {
    // set the state for the user data
    const [currentDate, setCurrentDate] = useState('');

    // get current datetime so that the user cannot select a date that is before the current date
    useEffect(() => {
        // Get the current date and time
        const now = new Date();
        
        // Add one day to the current date
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        
        const formattedDate = tomorrow.toISOString().slice(0, 16); // Format: "yyyy-mm-ddThh:mm"
        setCurrentDate(formattedDate);
    }, []);

    useEffect(() => {
        console.log('current date:', currentDate);
    }, [currentDate]);

    // set the state for the trip data
    const [tripData, setTripData] = useState({
        UserID: localStorage.getItem('userId'),
        PickupAddress: '',
        AltPickupAddress: '',
        StartDateTime: '',
        DestinationAddress: '',
        AvailableSeats: 0,
        TripStatus: '',
        PublishDate: null,
	    EstimatedEndTravelTime: null, 
	    TripDuration: 0, 
	    CompletedDateTime: null,    
    });

    // Handle the change in the trip details form
    function handleTripDetailChange(e) {
        const { name, value } = e.target;
        setTripData({ ...tripData, [name]: value });
        console.log(tripData);
    };

    // Calculate the estimated end date and time based on the start date and time and the trip duration
    function calculateEndTime() {
        if (tripData.StartDateTime !== "" && tripData.TripDuration > 0) {
            const tripDuration = parseInt(tripData.TripDuration);
            // add the trip duration (that is in minutes) to the start date time to get the estimated end date and time and convert into the format of YYYY-MM-DD HH:MM:SS
            console.log(new Date(tripData.StartDateTime).getTime())
            console.log(tripDuration*60000 + ' milliseconds')

            const estimatedEndTravelTime = new Date(new Date(tripData.StartDateTime).getTime() + tripDuration*60000);
            // add 8 hours to the estimated end travel time to get the estimated end travel time in Singapore time
            estimatedEndTravelTime.setHours(estimatedEndTravelTime.getHours() + 8);
            console.log('start date time:', tripData.StartDateTime)
            console.log('estimated end travel time:', estimatedEndTravelTime.toISOString().slice(0, 19).replace('T', ' '));
            return estimatedEndTravelTime.toISOString().slice(0, 19).replace('T', ' ');
        }
    }

    // Handle the submit button
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('trip data 123:', tripData);

        // get the current date in the format of YYYY-MM-DD
        const today = new Date();
        if (today.getDate() < 10) {
            today.setDate('0' + today.getDate());
        }
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        // split the StartDateTime (2023-12-13T17:10) into datetime (YYYY-MM-DD HH:MM:SS)
        const newDateAndTime = tripData.StartDateTime.split('T')[0] + ' ' + tripData.StartDateTime.split('T')[1] + ':00';
        
        // add the trip duration to the start date time to get the estimated end date and time and convert into the format of YYYY-MM-DD HH:MM:SS
        const estimatedEndDateTime = calculateEndTime();



        try {
            // Call the API to post the new trip
            const response = await fetch('http://localhost:5001/api/v1/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    UserID: parseInt(localStorage.getItem('userId')),
                    PickupAddress: tripData.PickupAddress,
                    AltPickupAddress: tripData.AltPickupAddress,
                    StartDateTime: newDateAndTime,
                    DestinationAddress: tripData.DestinationAddress,
                    AvailableSeats: parseInt(tripData.AvailableSeats),
                    TripStatus: 'created',
                    PublishDate: date,
                    EstimatedEndDateTime: estimatedEndDateTime ? {String: estimatedEndDateTime, Valid: true} : null,
                    TripDuration: parseInt(tripData.TripDuration), 
                    CompletedDateTime: null,  
                }),
                mode: 'cors', // Enable CORS
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                alert('Published successfully!', data);

                // Redirect to the main page
                window.location.reload();
            } else {
                // Handle error response
                alert('Error publishing:', response.statusText);
            }
        } catch (error) {
            alert('Error publishing:', error);
        }
    };
    
    // diplays the form for the user to enter the trip details
    return (
        <div>
            <div className="font-montserrat text-left text-2xl font-bold text-black">
                Publish New Trip
            </div>
            <div className="mt-10 h-full sm:mx-auto sm:w-full">
                <form className="space-y-6">
                    <div>
                        <label htmlFor="PickupAddress" className="block text-md font-medium leading-6 text-black font-rubik">
                            Pickup Address
                        </label>
                        <div className="mt-2">
                        <input
                            id="PickupAddress"
                            name="PickupAddress"
                            type="text"
                            placeholder='Enter the pickup address'
                            required
                            className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                            value={tripData.PickupAddress}
                            onChange={handleTripDetailChange}
                        />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="AltPickupAddress" className="block text-md font-medium leading-6 text-black font-rubik">
                                Alt Pickup Address
                            </label>
                        </div>
                        <div className="mt-2">
                        <input
                            id="AltPickupAddress"
                            name="AltPickupAddress"
                            type="text"
                            placeholder='Enter the alternate pickup address'
                            required
                            className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                            value={tripData.AltPickupAddress}
                            onChange={handleTripDetailChange}
                        />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="StartDateTime" className="block text-md font-medium leading-6 text-black font-rubik">
                            Start Date & Start Time
                        </label>
                        <div className="mt-2">
                        <input
                            id="StartDateTime"
                            name="StartDateTime"
                            type="datetime-local"
                            placeholder='Enter the start date and time'
                            required
                            className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                            value={tripData.StartDateTime}
                            onChange={handleTripDetailChange}
                            min={currentDate}
                        />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="DestinationAddress" className="block text-md font-medium leading-6 text-black font-rubik">
                            Destination Address
                        </label>
                        <div className="mt-2">
                        <input
                            id="DestinationAddress"
                            name="DestinationAddress"
                            type="text"
                            placeholder='Enter the destination address'
                            required
                            className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                            value={tripData.DestinationAddress}
                            onChange={handleTripDetailChange}
                        />
                        </div>
                    </div>



                    <div>
                        <label htmlFor="AvailableSeats" className="block text-md font-medium leading-6 text-black font-rubik">
                            No. of Passenger
                        </label>
                        <div className="mt-2">
                        <input
                            id="AvailableSeats"
                            name="AvailableSeats"
                            type="number"
                            placeholder='Enter the number of passenger(s)'
                            required
                            className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                            value={tripData.AvailableSeats}
                            onChange={handleTripDetailChange}
                        />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="TripDuration" className="block text-md font-medium leading-6 text-black font-rubik">
                            Trip Duration (in minutes)
                        </label>
                        <div className="mt-2">
                        <input
                            id="TripDuration"
                            name="TripDuration"
                            type="number"
                            placeholder='Enter the trip duration in minutes'
                            className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                            value={tripData.TripDuration}
                            onChange={handleTripDetailChange}
                        />
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            className="mt-16 flex w-full justify-center rounded-lg bg-red px-5 py-3 text-md font-rubik font-medium leading-6 text-white"
                            onClick={handleSubmit}
                        >
                        PUBLISH
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}