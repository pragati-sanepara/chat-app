'use client'

import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const router = useRouter();

  const navigateToDashboard = () => {
    router.push('/dashboard');
    // localStorage.setItem("token", "abcdtoken");
    // localStorage.setItem("userType", "admin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Login Page
      <div>
        <button onClick={signIn as any}>SignIn With Google</button>
      </div>
    </main>
  );
}
