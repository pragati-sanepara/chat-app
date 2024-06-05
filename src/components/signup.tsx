'use client'

import axios from "axios";
import { signIn } from "next-auth/react"
import { useState } from "react";

export default function Signup({ setIsSigninPage }: any) {
    const [userDetails, setUserDetails] = useState({ name: "", email: "", password: "" });

    const handleChangeInput = (event: any, type: "name" | "email" | "password") => {
        let data = { ...userDetails };
        data[type] = event.target.value;
        setUserDetails(data);
    }

    const handleSignup = () => {
        axios.post('/api/auth/signup', userDetails)
            .then(function (response: any) {
                console.log("response.message", response.data.message);
                setUserDetails({ name: "", email: "", password: "" });
                setIsSigninPage(true);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (<>
        <div className=" flex flex-col items-center">
            <div className="text-center">
                <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                    Sign up
                </h1>
                <p className="text-[12px] text-gray-500">
                    Hey enter your details to create your account
                </p>
            </div>
            <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-xs flex flex-col gap-4">
                    <input
                        className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="text"
                        placeholder="Enter your name"
                        value={userDetails.name}
                        onChange={(event) => handleChangeInput(event, "name")}
                    />
                    <input
                        className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="email"
                        placeholder="Enter your email"
                        value={userDetails.email}
                        onChange={(event) => handleChangeInput(event, "email")}
                    />
                    <input
                        className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="password"
                        placeholder="Password"
                        value={userDetails.password}
                        onChange={(event) => handleChangeInput(event, "password")}
                    />
                    <button className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                        <svg
                            className="w-6 h-6 -ml-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <path d="M20 8v6M23 11h-6" />
                        </svg>
                        <span className="ml-3" onClick={handleSignup}>Sign Up</span>
                    </button>
                    <p className="mt-6 text-xs text-gray-600 text-center">
                        Already have an account?{" "}
                        <b onClick={() => setIsSigninPage(true)}>
                            <span className="text-blue-900 font-semibold">Sign in</span>
                        </b>
                    </p>
                    <p className="mt-6 text-xs text-gray-600 text-center">
                        <button onClick={signIn as any}>SignIn With Google</button>
                    </p>
                </div>
            </div>
        </div>
    </>
    );
}
