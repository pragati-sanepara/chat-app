'use client'

import { useState } from "react";
import Signup from "@/components/signup";
import Signin from "@/components/Signin";

export default function Home() {
  const [isSigninPage, setIsSigninPage] = useState(true);
  
  return (<>
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 text-center hidden md:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          >
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full"
              alt="Phone image" />
          </div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          {isSigninPage ? <Signin setIsSigninPage={(value: boolean) => setIsSigninPage(value)} /> : <Signup setIsSigninPage={(value: boolean) => setIsSigninPage(value)} />}
        </div>
      </div>
    </div>
  </>
  );
}
