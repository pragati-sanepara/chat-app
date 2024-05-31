'use client'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket = io();

export default function About() {
    const [messages, setMessages] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>();
    const [curentUserName, setCurentUserName] = useState<any>("");
    const [selectedUser, setSelectedUser] = useState<any>();
    const [currentMsg, setCurrentMsg] = useState('');

    useEffect(() => {
        socket.on("connect", () => { });
        console.log("sasasasasa", socket.connected);
        socket.on("get-users", (usersData) => {
            console.log("userData", usersData);
            setUsers(usersData);
        });
        setCurentUserName(localStorage.getItem("currentUserData"));
        return () => {
            socket.on("disconnect", () => {
                console.log("Disconneteddd");
            });
        };
    });

    const sendMessage = () => {
        console.log("message");
        if (selectedUser) {
            socket.timeout(1000).emit('send-meesgae', currentMsg, curentUserName, selectedUser.name, (err: any, res: any) => {
                if (err) console.log("err", err);
                else {
                    console.log("res", res.status, res.data);
                    const updatedData = res.data.find((data: any) => data.name === selectUser.name);
                    setSelectedUser(updatedData);
                }
            });
            setCurrentMsg('');
        }
    };

    const selectUser = (user: any) => {
        setSelectedUser(user);
    }

    return (<>
        <div className="container mx-auto shadow-lg rounded-lg">
            <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
                <div className="font-semibold text-2xl">GoingChat</div>
                {/* <div className="w-1/2">
                    <input
                        type="text"
                        name=""
                        id=""
                        placeholder="search IRL"
                        className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
                    />
                </div> */}
                <div
                    className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center"
                >
                    {curentUserName}
                </div>
            </div>
            <div className="flex flex-row justify-between bg-white min-h-96">
                <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                    {users?.map((user: any) => {
                        return <div key={user.name} onClick={() => selectUser(user)}
                            className="flex flex-row py-4 px-2 justify-center items-center border-b-2"
                        >
                            <div className="w-1/4">
                                <img
                                    src="https://source.unsplash.com/_7LbC5J-jw4/600x600"
                                    className="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div className="w-full">
                                <div className="text-lg font-semibold">{user.name}</div>
                                <span className="text-gray-500">Pick me at 9:00 Am</span>
                            </div>
                        </div>
                    })}
                </div>
                <div className="w-full px-5 flex flex-col justify-between">
                    <div className="flex flex-col mt-5">
                        {selectedUser ? selectedUser.messages.map((msg: any) => {
                            return <div className="flex justify-end mb-4">
                                <div
                                    className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                >
                                    {msg.message}
                                </div>
                                <img
                                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                    className="object-cover h-8 w-8 rounded-full"
                                    alt=""
                                />
                            </div>
                        }) : "Please select any one for chat"}
                    </div>
                    <div className="py-5 flex flex-row py-4 px-2 justify-center items-center border-b-2">
                        <div className="w-full">
                            <input
                                className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                                type="text"
                                placeholder="Type your message here..."
                                value={currentMsg}
                                onChange={(e) => setCurrentMsg(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/4 flex justify-end">
                            <button onClick={sendMessage} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}