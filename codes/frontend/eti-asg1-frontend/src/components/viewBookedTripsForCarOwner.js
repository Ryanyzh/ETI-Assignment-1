import React from 'react';
import {useState, useEffect} from 'react';

export default function ViewBookedTripsForCarOwner () {
    // set the state for the user data
    const [tripDataList, setTripDataList] = useState(null);
    // const [searchQuery, setSearchQuery] = useState('');

    // Call the API to get the user's trips data
    async function getTripsData () {
        try {
            const response = await fetch(`http://localhost:5001/api/v1/carownerbookedtrips/${localStorage.getItem('userId')}`);
            console.log(response);
            console.log(`http://localhost:5001/api/v1/carownerbookedtrips/${localStorage.getItem('userId')}`);
            if (response.ok) {
                const tripsData = await response.json();
                // Update state with the received user data
                // console.log('Trips data:', tripsData);
                setTripDataList(tripsData);
            } else {
                alert('Error fetching user data:', response.statusText);
            }
        } catch (error) {
            alert('Error fetching user data:', error);
        }
    }

    // Call getUserData() when the component is first rendered
    if (!tripDataList || tripDataList === null) {
        getTripsData();
    }

    // handle the click of the start button
    async function handleStart(event, tripId){
        event.preventDefault();
        const tripBookingData = tripDataList.find((trip) => trip.TripID === tripId);
        console.log(tripBookingData)

        //edit the TripStatus to 'started'
        tripBookingData.TripStatus = 'started';

        try {
            // Call the API to update the trip data
            const response = await fetch(`http://localhost:5001/api/v1/trips/${tripId}`, {
                method: 'OPTIONS',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    UserID: parseInt(tripBookingData.UserID),
                    PickupAddress: tripBookingData.PickupAddress,
                    AltPickupAddress: tripBookingData.AltPickupAddress,
                    StartDateTime: tripBookingData.StartDateTime,
                    DestinationAddress: tripBookingData.DestinationAddress,
                    AvailableSeats: parseInt(tripBookingData.AvailableSeats),
                    TripStatus: tripBookingData.TripStatus,
                    PublishDate: tripBookingData.PublishDate,
                    EstimatedEndDateTime: tripBookingData.EstimatedEndDateTime,
                    TripDuration: parseInt(tripBookingData.TripDuration), 
                    CompletedDateTime: null,
                }),
                mode: 'cors', // Enable CORS
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                alert('Trip started successfully!', data);

                // Redirect to the main page
                window.location.reload();
            } else {
                // Handle error response
                alert('Unable to start trip:', response.statusText);
            }
        } catch (error) {
            alert('Unable to start trip:', error);
        }
    }

    // handle the click of the cancel button
    async function handleCancel(event, tripId){
        event.preventDefault();
        const tripBookingData = tripDataList.find((trip) => trip.TripID === tripId);
        console.log(tripBookingData)

        //edit the TripStatus to 'started'
        tripBookingData.TripStatus = 'cancelled';

        try {
            // Call the API to update the trip data
            const response = await fetch(`http://localhost:5001/api/v1/trips/${tripId}`, {
                method: 'OPTIONS',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    UserID: parseInt(tripBookingData.UserID),
                    PickupAddress: tripBookingData.PickupAddress,
                    AltPickupAddress: tripBookingData.AltPickupAddress,
                    StartDateTime: tripBookingData.StartDateTime,
                    DestinationAddress: tripBookingData.DestinationAddress,
                    AvailableSeats: parseInt(tripBookingData.AvailableSeats),
                    TripStatus: tripBookingData.TripStatus,
                    PublishDate: tripBookingData.PublishDate,
                    EstimatedEndDateTime: tripBookingData.EstimatedEndDateTime,
                    TripDuration: parseInt(tripBookingData.TripDuration), 
                    CompletedDateTime: null,
                }),
                mode: 'cors', // Enable CORS
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                alert('Trip cancelled successfully!', data);

                // Redirect to the main page
                window.location.reload();
            } else {
                // Handle error response
                alert('Unable to cancel trip:', response.statusText);
            }
        } catch (error) {
            alert('Unable to cancel trip:', error);
        }
    }

    // write a function to only enable the start button if the current date and time is 30 minutes of the trip start date and time
    // write a function to only enable the cancel button if the current date and time is also 30 mins before the trip start date and time
    function enableButtons(tripStartDateTime){
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;

        // tripStartDateTime is in the format of YYYY-MM-DD HH:MM:SS
        const tripStartedDateTime = tripStartDateTime.substring(0, tripStartDateTime.length);

        const diffInMs = Math.abs(new Date(dateTime) - new Date(tripStartedDateTime));
        const diffInMins = Math.floor((diffInMs/1000)/60);
        console.log(tripStartDateTime, diffInMins);

        if (diffInMins <= 30){
            //console.log('enable start button')
            return true;
        }
        else{
            //console.log('disable start button')
            return false;
        }
    }

    // Display the trips datam with the start and cancel buttons
    if (tripDataList) {
        return (
            <div>
                <div className="font-montserrat text-left text-2xl font-bold text-black">
                    View Booked Trips
                </div>

                

                <div class="mt-8 w-full overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-black border-separate border-spacing-y-3">
                        <thead class="text-sm text-black uppercase bg-transparent">
                            <tr>
                                <th scope="col" class="pl-6 pr-7 py-3 whitespace-nowrap">
                                    Pick Up Address
                                </th>
                                <th scope="col" class="pl-6 pr-7 py-3 whitespace-nowrap">
                                    Alt Pick Up Address
                                </th>
                                <th scope="col" class="pl-6 pr-7 py-3 whitespace-nowrap">
                                   Destination Address
                                </th>
                                <th scope="col" class="pl-6 pr-7 py-3 whitespace-nowrap">
                                   Start Date & Start Time
                                </th>
                                <th scope="col" class="pl-6 pr-7 py-3 whitespace-nowrap">
                                    Duration
                                </th>
                                <th scope="col" class="px-7 py-3 whitespace-nowrap">
                                    Seats Available
                                </th>
                                <th scope="col" class="px-7 py-3 whitespace-nowrap">
                                    Passenger Names
                                </th>
                                <th scope="col" class="px-7 py-3 whitespace-nowrap">
                                    <span class="sr-only">Buttons</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tripDataList.map((trip) => (
                                <tr key={trip.TripID} class="bg-white" >
                                    <td class="px-6 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.PickupAddress}
                                    </td>
                                    <td class="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.AltPickupAddress}
                                    </td>
                                    <td class="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.DestinationAddress}
                                    </td>
                                    <td class="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.StartDateTime}
                                    </td>
                                    <td class="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.TripDuration}
                                    </td>
                                    <td class="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.AvailableSeats}
                                    </td>
                                    <td class="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.Passengers.map((passenger) => (
                                            <span>
                                                {passenger.PassengerFirstName + ' ' + passenger.PassengerLastName}
                                                <br/>
                                            </span>
                                        ))}
                                    </td>
                                    <td class="pl-7 font-normal text-black font-rubik whitespace-nowrap text-right">
                                        <div className='flex flex-row'>
                                            <button 
                                                class="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-7 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red disabled:opacity-20"
                                                onClick={(event) => handleStart(event, trip.TripID)}
                                                disabled={enableButtons(trip.StartDateTime) === false ? true : false}
                                            >
                                                START
                                            </button>
                                            <button 
                                                class="ml-4 flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-7 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red disabled:opacity-20"
                                                onClick={(event) => handleCancel(event, trip.TripID)}
                                                disabled={enableButtons(trip.StartDateTime) === false ? true : false}
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                No booked trips found.
            </div>
        )
    }
}