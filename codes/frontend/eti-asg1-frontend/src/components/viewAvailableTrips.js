import React from 'react';
import {useState, useEffect} from 'react';

export default function ViewAvailableTrips () {
    // set the state for the trip data
    const [tripDataList, setTripDataList] = useState(null);
    const [bookingDataList, setBookingDataList] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [unavailableTiming, setUnavailableTiming] = useState([]);

    // Call the API to get all the trip data
    async function getTripsData () {
        try {
            const response = await fetch('http://localhost:5001/api/v1/trips');
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

    // Call the API to get the booking data based on the query
    async function getNewTripsData (destinationAddress) {
        try {
            // Construct the URL with the destination address as a query parameter
            const url = `http://localhost:5001/api/v1/trips?destinationAddress=${encodeURIComponent(destinationAddress)}`;

            console.log('hello', url);
            
            const response = await fetch(url);
      
            if (response.ok) {
                const tripsData = await response.json();
                // Update state with the received trip data
                console.log('Trips data:', tripsData);
                setTripDataList(tripsData);
            } else {
                alert('Error fetching trip data:', response.statusText);
            }
        } catch (error) {
            alert('Error fetching trip data:', error);
        }
    }

    // Call the API to get the booking data of the user
    async function getUserBookingData(){
        try {
            const response = await fetch(`http://localhost:5001/api/v1/passengerbookedtrips/${localStorage.getItem('userId')}`);
            console.log(response);
            console.log(`http://localhost:5001/api/v1/passengerbookedtrips/${localStorage.getItem('userId')}`);
            if (response.ok) {
                const bookings = await response.json();
                // Update state with the received user data
                console.log('bookings data:', bookings);
                setBookingDataList(bookings);

                if (bookings){
                    const unavailableTiming = [];
                    bookings.forEach(booking => {
                        // convert the start date time and estimated end date time to milliseconds before adding to the list
                        let startDateTimeInMilliseconds = new Date(booking.StartDateTime).getTime();
                        let estimatedEndDateTimeInMilliseconds = new Date(booking.EstimatedEndDateTime.String).getTime();
                        unavailableTiming.push([startDateTimeInMilliseconds, estimatedEndDateTimeInMilliseconds]);
                        //unavailableTiming.push([booking.StartDateTime, booking.EstimatedEndDateTime]);
                    });
                    setUnavailableTiming(unavailableTiming);
                }
                
            } else {
                alert('Error fetching user data:', response.statusText);
            }
        } catch (error) {
            alert('Error fetching user data:', error);
        }
    }

    // Call getTripsData() when the component is first rendered
    if (!tripDataList) {
        getTripsData();
        getUserBookingData();
    }

    // Call getUnavailableTiming() when the component is first rendered to display only the available trips based on the unavailable timings
    useEffect(() => {
        console.log('unavailableTiming', unavailableTiming);
        if (unavailableTiming && tripDataList) {
            const availableTrips = tripDataList.filter((trip) => {
                const tripStart = new Date(trip.StartDateTime).getTime();
                const tripEnd = new Date(trip.EstimatedEndDateTime.String).getTime();
            
                // Check if there is any overlap with unavailable timings
                const isUnavailable = unavailableTiming.some((unavailable) => {
                    const [unavailableStart, unavailableEnd] = unavailable;
                    return (
                        (tripStart >= unavailableStart && tripStart <= unavailableEnd) ||
                        (tripEnd >= unavailableStart && tripEnd <= unavailableEnd) ||
                        (tripStart <= unavailableStart && tripEnd >= unavailableEnd)
                    );
                });
            
                return !isUnavailable;
            });
            
            console.log('bye', availableTrips);
            setTripDataList(availableTrips);
        }
    }, [unavailableTiming])

    // function to handle the search query
    function handleSearch(event){
        event.preventDefault();
        
        // Extract the destination address from the form
        console.log("search", searchQuery);
        const destinationAddress = searchQuery;

        // Call the API with the destination address for partial search
        getNewTripsData(destinationAddress);
    }


    // function to handle the booking
    async function handleBooking(event, tripId) {

        event.preventDefault();

        // get all the trip data from the tripId based on the trip data list
        const tripBookingData = tripDataList.find(trip => trip.TripID === tripId);

        // edit certain fields of the trip data
        tripBookingData.AvailableSeats = tripBookingData.AvailableSeats - 1;
        if (tripBookingData.AvailableSeats === 0){
            tripBookingData.TripStatus = 'fully booked'
        }

        try {
            // Call the API to update the trip database
            const response = await fetch(`http://localhost:5001/api/v1/trips/${tripId}`, {
                method: 'OPTIONS',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    UserID: tripBookingData.UserID,
                    PickupAddress: tripBookingData.PickupAddress,
                    AltPickupAddress: tripBookingData.AltPickupAddress,
                    StartDateTime: tripBookingData.StartDateTime,
                    DestinationAddress: tripBookingData.DestinationAddress,
                    AvailableSeats: tripBookingData.AvailableSeats,
                    TripStatus: tripBookingData.TripStatus,
                    PublishDate: tripBookingData.PublishDate,
                    EstimatedEndDateTime: tripBookingData.EstimatedEndDateTime,
                    TripDuration: tripBookingData.TripDuration, 
                    CompletedDateTime: null,
                }),
                mode: 'cors', // Enable CORS
            });

            // Call the API to update the booking database
            const response1 = await fetch(`http://localhost:5001/api/v1/bookings/${localStorage.getItem('userId')}/${tripId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors', // Enable CORS
            });

            if (response.ok || response1.ok) {
                // Handle successful response
                const data = await response.json();
                alert('Booking made successfully!', data);

                // Redirect to the main page
                window.location.reload();
            } else {
                // Handle error response
                alert('Error updating:', response.statusText);
                alert('Error updating:', response1.statusText);
            }
        } catch (error) {
            alert('Error updating:', error);
        }
    };


    // // write a function to get all the start date time and estimated end date time from the booking data list
    // function getUnavailableTiming(){
    //     const unavailableTiming = [];
    //     bookingDataList.forEach(booking => {
    //         // convert the start date time and estimated end date time to milliseconds before adding to the list
    //         let startDateTimeInMilliseconds = new Date(booking.StartDateTime).getTime();
    //         let estimatedEndDateTimeInMilliseconds = new Date(booking.EstimatedEndDateTime.String).getTime();
    //         unavailableTiming.push([startDateTimeInMilliseconds, estimatedEndDateTimeInMilliseconds]);
    //         //unavailableTiming.push([booking.StartDateTime, booking.EstimatedEndDateTime]);
    //     });
    //     setUnavailableTiming(unavailableTiming);
    // }


    // // write a function to check if the start date time and estimated end date time of the trip is in the unavailable timing list and if it is, remove it from the tripDataList
    // function checkUnavailableTiming(){
    //     const newTripDataList = [];
    //     tripDataList.forEach(trip => {
    //         // convert the start date time and estimated end date time to milliseconds before adding to the list
    //         let startDateTimeInMilliseconds = new Date(trip.StartDateTime).getTime();
    //         let estimatedEndDateTimeInMilliseconds = new Date(trip.EstimatedEndDateTime.String).getTime();
    //         let isUnavailable = false;
    //         unavailableTiming.forEach(unavailable => {
    //             if (startDateTimeInMilliseconds >= unavailable[0] && estimatedEndDateTimeInMilliseconds <= unavailable[1]){
    //                 isUnavailable = true;
    //             }
    //         });
    //         if (!isUnavailable){
    //             //console.log("1", trip);
    //             newTripDataList.push(trip);
    //         }
    //         else {
    //             console.log("2", trip);
    //         }
    //     });
    //     setTripDataList(newTripDataList);

    // }

    // Display the available trips
    if (tripDataList) {
        return (
            <div>
                <div className="font-montserrat text-left text-2xl font-bold text-black">
                    View Available Trips
                </div>

                
                <form className="mt-10 font-montserrat text-left text-black" onSubmit={handleSearch}>   
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            id="default-search" 
                            className="block w-full p-4 ps-12 text-sm text-black border-2 border-black rounded-lg bg-white font-medium font-rubik" 
                            placeholder="Search your preferred destination address..."
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="absolute end-0 bottom-0 bg-blue-700 text-md rounded-lg bg-white border-2 border-black px-10 py-[14px] text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-2 hover:border-black active:bg-red active:text-white active:border-black"
                        >
                            Search
                        </button>
                    </div>
                </form>

                

                <div className="mt-5 w-full overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-black border-separate border-spacing-y-3">
                        <thead className="text-sm text-black uppercase bg-transparent">
                            <tr>
                                <th scope="col" className="pl-6 pr-7 py-3 whitespace-nowrap">
                                    Pick Up Address
                                </th>
                                <th scope="col" className="pl-6 pr-7 py-3 whitespace-nowrap">
                                    Alt Pick Up Address
                                </th>
                                <th scope="col" className="pl-6 pr-7 py-3 whitespace-nowrap">
                                   Destination Address
                                </th>
                                <th scope="col" className="pl-6 pr-7 py-3 whitespace-nowrap">
                                   Start Date & Start Time
                                </th>
                                <th scope="col" className="pl-6 pr-7 py-3 whitespace-nowrap">
                                    Duration
                                </th>
                                <th scope="col" className="pl-6 pr-7 py-3 whitespace-nowrap">
                                    Seats Available
                                </th>
                                <th scope="col" className="pl-6 pr-7 py-3 whitespace-nowrap">
                                    Driver Name
                                </th>
                                <th scope="col" className="pl-6 pr-7 py-3 whitespace-nowrap">
                                    <span className="sr-only">Book</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tripDataList.map((trip) => (
                                <tr key={trip.TripID} className="bg-white" >
                                    <td className="px-6 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.PickupAddress}
                                    </td>
                                    <td className="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.AltPickupAddress}
                                    </td>
                                    <td className="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.DestinationAddress}
                                    </td>
                                    <td className="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.StartDateTime}
                                    </td>
                                    <td className="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.TripDuration}
                                    </td>
                                    <td className="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.AvailableSeats}
                                    </td>
                                    <td className="px-7 py-4 font-normal text-black font-rubik whitespace-nowrap">
                                        {trip.DriverFirstName + ' ' + trip.DriverLastName}
                                    </td>
                                    <td className="pl-7 font-normal text-black font-rubik whitespace-nowrap text-right">
                                        <button 
                                            className="flex w-full h-full items-center justify-center bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                            onClick={(event) => handleBooking(event, trip.TripID)}
                                    >
                                        BOOK
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
                Loading...
            </div>
        )
    }
}