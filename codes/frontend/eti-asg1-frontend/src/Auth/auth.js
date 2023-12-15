// Import necessary modules and components
import React, { useState } from 'react';
import '../App.css'

export default function AuthPage() {
    // Declare state variables
    const [signInUser, setSignInUser] = useState({
        signinemail: '',
        signinpassword: ''
    });
    const [signUpUser, setSignUpUser] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        driverLicense: '',
        carPlateNumber: ''
    })

    // Declare functions
    // Handle change in the sign-in form
    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInUser({ ...signInUser, [name]: value });
        console.log(signInUser);
    };
    // Handle change in the sign-up form
    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpUser({ ...signUpUser, [name]: value });
        console.log(signUpUser);
    };
    // Handle sign-in event (call the API)
    const handleSignIn = async (event) => {
        event.preventDefault();
        //console.log('Sign in user:', signInUser);
        try {
            // Call the API to sign in
            const response = await fetch('http://localhost:5000/api/v1/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ EmailAddress: signInUser.signinemail, UserPassword: signInUser.signinpassword }),
                mode: 'cors', // Enable CORS
            });

            if (response.ok) {
                // Handle successful sign-in
                const data = await response.json();
                alert('Signed in successfully!', data);

                // Store data in local storage
                localStorage.setItem('userId', data.UserID);
                localStorage.setItem('userType', data.UserType);
                localStorage.setItem('firstName', data.FirstName);

                // Redirect to the main page
                window.location.reload();
            } else {
                // Handle sign-in error
                alert('Error signing in:', response.statusText);
            }
        } catch (error) {
            alert('Error signing in:', error);
        }
    };
    // Handle sign-up event (call the API)
    const handleSignUp = async (event) => {
        event.preventDefault();
        //console.log('Sign up user:', signUpUser);

        // const driverLicense = signUpUser.driverLicense ? signUpUser.driverLicense : null;
        // const carPlateNumber = signUpUser.carPlateNumber ? signUpUser.carPlateNumber : null;
        const usertype = signUpUser.driverLicense==="" && signUpUser.carPlateNumber==="" ? 'passenger' : 'car owner';
        console.log(usertype);

        // get today's date
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();


        try {
            // Call the API to sign up
            const response = await fetch('http://localhost:5000/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    UserID: 0,
                    FirstName: signUpUser.firstName,
                    LastName: signUpUser.lastName,
                    MobileNumber: signUpUser.mobileNumber,
                    EmailAddress: signUpUser.email, 
                    UserPassword: signUpUser.password,
                    DriverLicense: signUpUser.driverLicense ? {String: signUpUser.driverLicense, Valid: true} : null,
                    CarPlateNumber: signUpUser.carPlateNumber ? {String: signUpUser.carPlateNumber, Valid:true} : null,
                    CreationDate: date,
	                LastUpdate: date,
	                DeletionDate: null,
	                UserType: usertype,
                }),
                mode: 'cors', // Enable CORS
            });

            if (response.ok) {
                // Handle successful sign-up
                const data = await response.json();

                // get the "UserID" from the response
                const userId = data.UserID;

                alert('Signed up successfully!', userId);

                // Store data in local storage
                localStorage.setItem('userId', data.UserID);
                localStorage.setItem('userType', data.User.UserType);
                localStorage.setItem('firstName', data.User.FirstName);

                // Redirect to the main page
                window.location.reload();
            } else {
                // Handle sign-in error
                alert('Error signing up:', response.statusText);
            }
        } catch (error) {
            alert('Error signing up:', error);
        }
    };

    
    // Display the sign-in and sign-up forms
    return (
        <div className="w-full h-full flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="flex w-full h-full flex-col justify-center">
                <div className='w-full h-full md:grid md:grid-cols-2 lg:gap-x-6'>
                    <div className='flex flex-col item-center pt-12 pb-20'>
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <h2 className="mt-10 font-montserrat text-left text-4xl font-bold text-black">
                                Sign In
                            </h2>
                        </div>

                        <div className="mt-16 h-full sm:mx-auto sm:w-full sm:max-w-md">
                            <form className="space-y-6" onSubmit={handleSignIn}>
                                <div>
                                    <label 
                                        htmlFor="signinemail" 
                                        className="block text-md font-medium leading-6 text-black font-rubik"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                    <input
                                        id="signinemail"
                                        name="signinemail"
                                        type="email"
                                        placeholder='Enter your email address'
                                        required
                                        value={signInUser.signinemail}
                                        onChange={handleSignInChange}
                                        className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik shadow-sm placeholder:text-gray-400 sm:text-md sm:leading-6"
                                    />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label 
                                            htmlFor="signinpassword" 
                                            className="block text-md font-medium leading-6 text-black font-rubik"
                                        >
                                            Password
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                    <input
                                        id="signinpassword"
                                        name="signinpassword"
                                        type="password"
                                        placeholder='Enter your password'
                                        required
                                        value={signInUser.signinpassword}
                                        onChange={handleSignInChange}
                                        className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik shadow-sm placeholder:text-gray-400 sm:text-md sm:leading-6"
                                    />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="mt-16 flex w-full justify-center rounded-lg bg-red px-5 py-3 text-md font-rubik font-medium leading-6 text-white"
                                    >
                                    SIGN IN
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>



                    <div className='border-l-2 border-black pt-12 pb-20 overflow-y-auto'>
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <h2 className="mt-10 font-montserrat text-left text-4xl font-bold text-black">
                                Sign Up
                            </h2>
                        </div>

                        <div className="mt-16 h-full sm:mx-auto sm:w-full sm:max-w-md">
                            <form className="space-y-6" onSubmit={handleSignUp}>
                                <div>
                                    <label 
                                        htmlFor="email" 
                                        className="block text-md font-medium leading-6 text-black font-rubik"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder='Enter your email address'
                                        required
                                        value={signUpUser.email}
                                        onChange={handleSignUpChange}
                                        className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                    />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label 
                                            htmlFor="password" 
                                            className="block text-md font-medium leading-6 text-black font-rubik"
                                        >
                                            Password
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder='Enter your password'
                                        required
                                        value={signUpUser.password}
                                        onChange={handleSignUpChange}
                                        className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                    />
                                    </div>
                                </div>

                                <div>
                                    <label 
                                        htmlFor="firstName" 
                                        className="block text-md font-medium leading-6 text-black font-rubik"
                                    >
                                        First Name
                                    </label>
                                    <div className="mt-2">
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder='Enter your first name'
                                        required
                                        value={signUpUser.firstName}
                                        onChange={handleSignUpChange}
                                        className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                    />
                                    </div>
                                </div>


                                <div>
                                    <label 
                                        htmlFor="lastName" 
                                        className="block text-md font-medium leading-6 text-black font-rubik"
                                    >
                                        Last Name
                                    </label>
                                    <div className="mt-2">
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder='Enter your last name'
                                        required
                                        value={signUpUser.lastName}
                                        onChange={handleSignUpChange}
                                        className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                    />
                                    </div>
                                </div>



                                <div>
                                    <label 
                                        htmlFor="mobileNumber" 
                                        className="block text-md font-medium leading-6 text-black font-rubik"
                                    >
                                        Mobile Number
                                    </label>
                                    <div className="mt-2">
                                    <input
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        type="number"
                                        placeholder='Enter your mobile number'
                                        required
                                        value={signUpUser.mobileNumber}
                                        onChange={handleSignUpChange}
                                        className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                    />
                                    </div>
                                </div>


                                <div>
                                    <label 
                                        htmlFor="driverLicense" 
                                        className="block text-md font-medium leading-6 text-black font-rubik"
                                    >
                                        Driver License (fill up only if you are a car owner)
                                    </label>
                                    <div className="mt-2">
                                    <input
                                        id="driverLicense"
                                        name="driverLicense"
                                        type="text"
                                        placeholder='Enter your driver license'
                                        value={signUpUser.driverLicense}
                                        onChange={handleSignUpChange}
                                        className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                    />
                                    </div>
                                </div>


                                <div>
                                    <label 
                                        htmlFor="carPlateNumber" 
                                        className="block text-md font-medium leading-6 text-black font-rubik"
                                    >
                                        Car Plate Number(fill up only if you are a car owner)
                                    </label>
                                    <div className="mt-2">
                                    <input
                                        id="carPlateNumber"
                                        name="carPlateNumber"
                                        type="text"
                                        placeholder='Enter your car plate number'
                                        value={signUpUser.carPlateNumber}
                                        onChange={handleSignUpChange}
                                        className="block w-full rounded-lg border-2 border-black py-2.5 px-4 text-black font-rubik placeholder:text-gray-400 sm:text-md sm:leading-6"
                                    />
                                    </div>
                                </div>


                                <div>
                                    <button
                                        type="submit"
                                        className="mt-16 flex w-full justify-center rounded-lg bg-red px-5 py-3 text-md font-rubik font-medium leading-6 text-white"
                                    >
                                    SIGN UP
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

