import React from 'react';
import {useState, useEffect} from 'react';

export default function DisplayDeleteAccount () {

    // set the state for the user data
    const [userData, setUserData] = useState(null);

    // Call the API to get the user data
    async function getUserData () {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/users/${localStorage.getItem('userId')}`);
            if (response.ok) {
                const userData = await response.json();
                // Update state with the received user data
                setUserData(userData);
            } else {
                alert('Error fetching user data:', response.statusText);
            }
        } catch (error) {
            alert('Error fetching user data:', error);
        }
    }

    // Call getUserData() when the component is first rendered
    if (!userData || userData === null) {
        getUserData();
    }

    // Handle the delete account button
    const handleDelete = async (event) => {
        event.preventDefault();
        // get the current date in the format of YYYY-MM-DD
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        try {
            // Call the API to update the user data
            const response = await fetch(`http://localhost:5000/api/v1/users/${localStorage.getItem('userId')}`, {
                method: 'OPTIONS',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    FirstName: userData.FirstName,
                    LastName: userData.LastName,
                    MobileNumber: userData.MobileNumber,
                    EmailAddress: userData.EmailAddress, 
                    UserPassword: userData.UserPassword,
                    DriverLicense: null,
                    CarPlateNumber: null, 
                    CreationDate: userData.CreationDate,
                    LastUpdate: userData.LastUpdate,
                    DeletionDate: date ? {String: date, Valid:true} : {String: date, Valid:true},
                    UserType: userData.UserType
                }),
                mode: 'cors', // Enable CORS
            });

            if (response.ok) {
                // Handle successful sign-in
                const data = await response.json();
                alert('Deleted successfully!', data);

                // Redirect to the login page
                localStorage.clear();
                window.location.reload();
            } else {
                // Handle sign-in error
                alert('Error deleting:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting:', error);
        }
    };

    // Handle the cancel button
    const handleCancel = () => {
        window.location.reload();
    }

    //find a function to find the days difference between the creation date and today's date. if the difference is less than 365 days, then display the message below. else, display the delete account page
    const findDaysDifference = () => {
        if (userData) {
            const today = new Date();
            console.log('Today:', userData.CreationDate);
            const creationDate = userData.CreationDate;
            //currently the creation date is in the format of YYYY-MM-DD, need to convert it to Date object
            const dateCreated = new Date(creationDate);
            const difference = today - dateCreated;
            const daysDifference = Math.floor(difference/1000/60/60/24);
            return daysDifference;
        }
        
    }

    // Display the delete account page
    if (userData){
        // if the difference is more than 365 days, display the delete account page
        if (findDaysDifference() >= 365) {
            return (
                <div>
                    <div className="font-montserrat text-left text-2xl font-bold text-black">
                        Delete Account
                    </div>
                    <div className="mt-10 font-montserrat text-left text-lg font-bold text-black">
                        Are you sure you want to delete your account?
                    </div>
                    <div className='mt-10 w-full h-auto grid grid-cols-2 md:gap-x-10'>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={handleCancel}
                            >
                            CANCEL
                            </button>
                        </div>
                        <div className="sm:mx-auto w-full">
                            <button
                                type="button"
                                className="flex w-full h-full items-center justify-center rounded-lg bg-white border-2 border-black px-5 py-3 text-md font-rubik font-medium text-black hover:bg-red hover:text-white hover:border-red active:bg-red active:text-white active:border-red"
                                onClick={handleDelete}
                            >
                            DELETE
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        // if the difference is less than 365 days, then display the message below.
        else {
            return (
                <div>
                    <div className="font-montserrat text-center text-2xl font-bold text-black">
                        You can only delete your account after a year from creation.
                    </div>
                </div>
            )
        }
    }
    else {
        return (
            <div>
                Loading...
            </div>
        )
    }
    

    
}