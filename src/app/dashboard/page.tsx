"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import axios from 'axios';
import { error } from "console";
import React from "react";

export default function Page() {
    let socket = useMemo(() => io(), []);

    const router = useRouter();
    const [selectedUser, setSelectedUser] = useState<any>();
    const [currentUser, setCurrentUser] = useState<any>('');
    const [searchUser, setSearchUser] = useState<any>('');
    const [currentMsg, setCurrentMsg] = useState('');
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [users, setUsers] = useState([]);
    const [conversationWithUsers, setConversationWithUsers] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        socket.auth = { userId };
        socket.on("connect", () => {
            console.log("socket.id", socket.id);
            socket.emit('join', userId);
        });
        socket.connect();

        axios.get(`api/user/get-all`)
            .then((res) => {
                setUsers(res.data);
            })
            .catch((error) => {
                console.log("error", error);
            });

        getChat(userId);

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("message", (conversationData) => {
            console.log("message", conversationData);
            setMessages(conversationData?.messages || []);
        });
        socket.on("online-user", (onlineUsersData) => {
            console.log("onlineUsersinside", onlineUsersData);
            setOnlineUsers(onlineUsersData);
        });
    }, []);

    const getChat = (id: string | null) => {
        if (!id) {
            return;
        }
        axios.post("api/conversation/get-by-id", { id })
            .then((res) => {
                console.log("api/conversation/get-by-id", res);
                setConversationWithUsers(res.data.conversation);
                setCurrentUser(res.data.user);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }

    const sendMessage = async () => {
        socket.emit("send-message", currentUser._id, selectedUser?._id, currentMsg);
        setCurrentMsg('');
    };

    const handleSelectuser = (user: any) => {
        setSelectedUser(user);
        axios.post("api/conversation/get-by-id-chat", { msgSentBy: currentUser._id, msgSentTo: user._id })
            .then((res) => {
                console.log("api/conversation/get-by-id-chat", res);
                setMessages(res.data.conversation?.messages || []);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }

    const handleSearchuser = (event: any) => {
        const { value }: { value: string } = event.target;
        setSearchUser(value);
        axios.get(`api/user/get-all?search=${value}`)
            .then((res) => {
                setUsers(res.data);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }

    const startChatWithUser = (user: any) => {
        handleSelectuser(user);
        setConversationWithUsers((prev) => [...prev, { ...user, new: true }]);
        setSearchUser("");
    }

    return (
        <div className="container mx-auto shadow-lg rounded-lg">
            <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
                <div className="font-semibold text-2xl">GoingChat</div>
                <div className="w-1/2">

                    <div className="relative">
                        <input
                            type="search"
                            name=""
                            id=""
                            value={searchUser}
                            onChange={handleSearchuser}
                            placeholder="Search User"
                            className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
                        />
                        {searchUser ? <div className="absolute z-10 w-full border rounded-lg shadow divide-y max-h-72 overflow-y-auto bg-white mt-1">
                            {users.map((user: any) => {
                                return <p key={user._id} className="block p-2 hover:bg-indigo-50" onClick={() => startChatWithUser(user)}>{user.name}</p>
                            })}
                        </div> : null}
                    </div>
                </div>
                <div
                    className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center"
                >
                    {currentUser.name}
                </div>
            </div>
            <div className="flex flex-row justify-between bg-white min-h-96">
                <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                    {conversationWithUsers?.map((conversation: any) => {
                        const userData: any = !conversation.new ? (conversation.senderId._id === currentUser._id ? conversation.receiverId : conversation.senderId) : conversation;
                        return <div key={conversation._id} onClick={() => handleSelectuser(userData)}
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
                                <div className="text-lg font-semibold">{userData.name}</div>
                                <span className="text-gray-500"> {onlineUsers.includes(userData._id) ? "on" : "off"} Pick me at 9:00 Am</span>
                            </div>
                        </div>
                    })}
                </div>
                <div className="w-full px-5 flex flex-col justify-between">
                    {selectedUser?._id ? <>
                        <div className="flex flex-col mt-5">
                            <div className="text-lg font-semibold">{selectedUser?.name}</div>
                            {messages.length ? messages.map((msg) => {
                                return <React.Fragment key={msg._id}>
                                    {msg.receiverId !== selectedUser._id ?
                                        <div className="flex justify-start mb-4">
                                            <img
                                                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                                className="object-cover h-8 w-8 rounded-full"
                                                alt=""
                                            />
                                            <div
                                                className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                        :
                                        <div className="flex justify-end mb-4">
                                            <div
                                                className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                            >
                                                {msg.text}
                                            </div>
                                            <img
                                                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                                className="object-cover h-8 w-8 rounded-full"
                                                alt=""
                                            />
                                        </div>
                                    }
                                </React.Fragment>
                            }) : null}
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
                    </> : "Please select any one for chat"}
                </div>
            </div>
        </div>
    );
}