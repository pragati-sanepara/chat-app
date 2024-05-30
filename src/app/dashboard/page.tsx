"use client";

import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect, useState } from "react";

import { Socket, io } from "socket.io-client";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Page() {
    // State to store the messages
    const [messages, setMessages] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    // State to store the current message
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
        socket = io({ autoConnect: false });

        socket.onAny((event, ...args) => {
            console.log("onAny", event, args);
        });

        socket.on("users", (users) => {
            users.forEach((user: { self: boolean; userID: string | undefined; }) => {
                user.self = user.userID === socket.id;
            });
            // put the current user first, and then sort by username
            users = users.sort((a: { self: any; username: number; }, b: { self: any; username: number; }) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
        });

        socket.on("user connected", (user) => {
            const updatedUsers: any = users.push(user);
            setUsers(updatedUsers);
        });

        return () => {
            socket.on("disconnect", () => {
                setCurrentMessage("Disconnnncted");
            });
        };
    });

    const sendMessage = async () => {
        // Send the message to the server
        // socket.timeout(1000).emit('request', currentMessage, (err: any, res: any) => {
        //     if (err) console.log("errrr", err);
        //     else console.log("ressss", res);
        // });
        socket.auth = { currentMessage };
        socket.on("connect", () => {
            console.log('Connected with ID:', socket.id);
            setCurrentMessage("Connnncted");
        });
        // setCurrentMessage('');
    };

    return (
        <div>
            {/* Display the messages */}
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}

            {/* Input field for sending new messages */}
            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
            />

            {/* Button to submit the new message */}
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}