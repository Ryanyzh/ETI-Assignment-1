import React from 'react';
import {useState, useEffect} from 'react';

export default function ViewCompletedTrips () {
    // set the state for the user data
    const [tripDataList, setTripDataList] = useState(null);
    //const [searchQuery, setSearchQuery] = useState('');

    // Call the API to get the user's trip data
    async function getTripsData () {
        try {
            const response = await fetch(`http://localhost:5001/api/v1/completedtrips/${localStorage.getItem('userId')}`);
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
    
    // Display the trips data
    if (tripDataList) {
        return (
            <div>
                <div className="font-montserrat text-left text-2xl font-bold text-black">
                    View Completed Trips
                </div>

                <div class="mt-5 w-full overflow-x-auto">
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
                                   Completed DateTime
                                </th>
                                <th scope="col" class="pl-6 pr-7 py-3 whitespace-nowrap">
                                    Driver Name
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tripDataList.map((trip) => (
                                <tr key={trip.TripID} class="bg-white border-2 border-black rounded-lg" >
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
                                        {trip.CompletedDateTime}
                                    </td>
                                    <td class="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.DriverFirstName + ' ' + trip.DriverLastName}
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
                You Have No Completed Trips
            </div>
        )
    }
}