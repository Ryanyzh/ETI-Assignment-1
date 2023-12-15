import React from 'react';
import {useState, useEffect} from 'react';

export default function ViewStartedTrips () {
    // set the state for the user data
    const [tripDataList, setTripDataList] = useState(null);

    // Call the API to get the user's trip data
    async function getTripsData () {
        try {
            const response = await fetch(`http://localhost:5001/api/v1/startedtrips/${localStorage.getItem('userId')}`);
            console.log(response);
            if (response.ok) {
                const tripsData = await response.json();
                // Update state with the received user data
                console.log('Trips data:', tripsData);
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

    // Handle the complete trip button
    async function handleComplete(event, tripId){
        event.preventDefault();
        const tripBookingData = tripDataList.find((trip) => trip.TripID === tripId);
        //console.log(tripBookingData)

        // get the current date and time in the format of YYYY-MM-DD HH:MM:SS
        const today = new Date();
        if (today.getDate() < 10) {
            today.setDate('0' + today.getDate());
        }
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;

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
                    TripStatus: 'completed',
                    PublishDate: tripBookingData.PublishDate,
                    EstimatedEndDateTime: tripBookingData.EstimatedEndDateTime ? {String: tripBookingData.EstimatedEndDateTime.String, Valid: true} : null,
                    TripDuration: parseInt(tripBookingData.TripDuration), 
                    CompletedDateTime: dateTime ? {String: dateTime, Valid: true} : null,
                }),
                mode: 'cors', // Enable CORS
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                alert('Trip completed successfully!', data);

                // Redirect to the main page
                window.location.reload();
            } else {
                // Handle error response
                alert('Unable to complete trip:', response.statusText);
            }
        } catch (error) {
            alert('Unable to completed trip:', error);
        }
    }

    
    // Display the trips data
    if (tripDataList) {
        return (
            <div>
                <div className="font-montserrat text-left text-2xl font-bold text-black">
                    View Started Trips
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
                                    Estimated End Date & End Time
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
                                        {trip?.EstimatedEndDateTime.String}
                                    </td>
                                    <td class="pl-7 font-normal text-black font-rubik whitespace-nowrap text-right">
                                    <button 
                                        class="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-7 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                        onClick={(event) => handleComplete(event, trip.TripID)}
                                    >
                                        COMPLETE
                                    </button>
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
                You have no trips that have started.
            </div>
        )
    }
}