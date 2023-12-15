// Import necessary modules and components
import React from 'react';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';



export default function UpdatePassengerAccount () {
    // set the state for the user data
    const [userData, setUserData] = useState(null);

    // Call the API to get the user data
    async function getUserData () {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/users/${localStorage.getItem('userId')}`);
            if (response.ok) {
                const userData = await response.json();
                // Update state with the received user data
                //console.log('User data:', userData);
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

    // handle the change of the input fields in the form
    function handleAccountDetailChange(e) {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        console.log(userData);
    };

    // Handle the update account button
    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log('Sign in user:', userData);

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
                    LastUpdate: date,
                    DeletionDate: null, 
                    UserType: userData.UserType
                }),
                mode: 'cors', // Enable CORS
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                alert('Updated successfully!', data);

                // Redirect to the main page
                window.location.reload();
            } else {
                // Handle error response
                alert('Error updating:', response.statusText);
            }
        } catch (error) {
            alert('Error updating:', error);
        }
    };
    
    // Display the update account form
    if (userData) {
        return (
            <div>
                <div className="font-montserrat text-left text-2xl font-bold text-black">
                    Update Account
                </div>
                <div className="mt-10 h-full sm:mx-auto sm:w-full">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="EmailAddress" className="block text-md font-medium leading-6 text-black font-rubik">
                                Email address
                            </label>
                            <div className="mt-2">
                            <input
                                id="EmailAddress"
                                name="EmailAddress"
                                type="email"
                                placeholder='Enter your email address'
                                required
                                className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                value={userData.EmailAddress}
                                onChange={handleAccountDetailChange}
                            />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="UserPassword" className="block text-md font-medium leading-6 text-black font-rubik">
                                Password
                            </label>
                            {/* <div className="flex items-center justify-between">
                                <label htmlFor="UserPassword" className="block text-md font-medium leading-6 text-black font-rubik">
                                    Password
                                </label>
                            </div> */}
                            <div className="mt-2">
                            <input
                                id="UserPassword"
                                name="UserPassword"
                                type="password"
                                placeholder='Enter your password'
                                required
                                className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                value={userData.UserPassword}
                                onChange={handleAccountDetailChange}
                            />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="FirstName" className="block text-md font-medium leading-6 text-black font-rubik">
                                First Name
                            </label>
                            <div className="mt-2">
                            <input
                                id="FirstName"
                                name="FirstName"
                                type="text"
                                placeholder='Enter your first name'
                                required
                                className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                value={userData.FirstName}
                                onChange={handleAccountDetailChange}
                            />
                            </div>
                        </div>


                        <div>
                            <label htmlFor="LastName" className="block text-md font-medium leading-6 text-black font-rubik">
                                Last Name
                            </label>
                            <div className="mt-2">
                            <input
                                id="LastName"
                                name="LastName"
                                type="text"
                                placeholder='Enter your last name'
                                required
                                className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                value={userData.LastName}
                                onChange={handleAccountDetailChange}
                            />
                            </div>
                        </div>



                        <div>
                            <label htmlFor="MobileNumber" className="block text-md font-medium leading-6 text-black font-rubik">
                                Mobile Number
                            </label>
                            <div className="mt-2">
                            <input
                                id="MobileNumber"
                                name="MobileNumber"
                                type="number"
                                placeholder='Enter your mobile number'
                                required
                                className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                value={userData.MobileNumber}
                                onChange={handleAccountDetailChange}
                            />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="mt-16 flex w-full justify-center rounded-lg bg-red px-5 py-3 text-md font-rubik font-medium leading-6 text-white"
                            >
                            UPDATE ACCOUNT
                            </button>
                        </div>
                    </form>
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