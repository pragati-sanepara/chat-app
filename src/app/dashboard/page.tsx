"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket = io({ autoConnect: false });

export default function Page() {
    const router = useRouter();
    const [connected, setConnected] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        socket.on("connect", () => {
            if (connected && userName) {                
                console.log("ifff", connected, userName);
                localStorage.setItem("currentUserData", userName);
                const user = {
                    name: userName,
                    status: false,
                    socketId: socket.id,
                    messages: [],
                }
                socket.emit('user-store', user);
                router.push("/dashboard/about");
            } else {
                console.log("else ");
            }
        });

        return () => {
            socket.on("disconnect", () => {
                setUserName("Disconnnncted");
            });
        };
    }, [connected]);

    const sendMessage = async () => {
        setConnected(true);
        socket.connect();
    };

    return (
        <div>
            {/* Input field for sending new messages */}
            <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />

            {/* Button to submit the new message */}
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}