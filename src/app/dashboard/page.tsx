"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from 'axios';
import React from "react";

export default function Page() {
    let socket = useMemo(() => io(), []);

    const [selectedUser, setSelectedUser] = useState<{ _id: string, name: string }>();
    const [currentUser, setCurrentUser] = useState<any>('');
    const [searchUser, setSearchUser] = useState<any>('');
    const [currentMsg, setCurrentMsg] = useState('');
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [users, setUsers] = useState([]);
    const [conversationWithUsers, setConversationWithUsers] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    const selectedUserRef = useRef(selectedUser);
    const currentUserRef = useRef(currentUser);
    const msgsDivRef = useRef<any>();

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    useEffect(() => {
        currentUserRef.current = currentUser;
    }, [currentUser]);

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
                console.error("error", error);
            });

        getConversationWithUsers(userId);
        getCurrentUserDetails(userId);

        return () => {
            socket.disconnect();
        };
    }, []);

    const triggerOnGetMessage = (conversationData: any, senderId: any, receiverId: any) => {
        const selectedUser = selectedUserRef.current;
        const currentUser = currentUserRef.current;

        console.log("triggerOnGetMessage", selectedUser, currentUser);

        if (selectedUser && ((selectedUser._id === senderId) || (selectedUser._id === receiverId))) {
            setMessagesOnSend(conversationData, senderId, receiverId);
        } else {
            console.log("else elseelseelseelse", senderId, currentUser?._id);
            if (currentUser && senderId !== currentUser?._id) {
                getConversationWithUsers(receiverId);
            }
        }
    };

    const setMessagesOnSend = (conversationData: any, senderId: any, receiverId: any) => {
        const selectedUser = selectedUserRef.current;
        const currentUser = currentUserRef.current;

        console.log("setMessagesOnSend", selectedUser, currentUser, senderId === receiverId, senderId === selectedUser?._id, receiverId === selectedUser?._id && selectedUser?._id !== currentUser._id);

        if (senderId === receiverId || senderId === selectedUser?._id) {
            getMessages(selectedUser, "select");
            console.log("if condition", senderId === receiverId, senderId === selectedUser?._id);
        } else if (receiverId === selectedUser?._id && selectedUser?._id !== currentUser._id) {
            setMessages(conversationData?.messages || []);
            console.log("else if condition", receiverId === selectedUser?._id, selectedUser?._id !== currentUser._id);
        } else {
            setMessages([]);
            console.log("else condition");
        }
    };

    useEffect(() => {
        const handleNewMessage = (conversationData: any, senderId: any, receiverId: any) => {
            console.log("message", conversationData, senderId, receiverId, selectedUserRef.current);
            triggerOnGetMessage(conversationData, senderId, receiverId);
        };

        const handleOnlineUsers = (onlineUsersData: any) => {
            console.log("onlineUsersinside", onlineUsersData);
            setOnlineUsers(onlineUsersData);
        };

        const handleSeenAckToSender = (senderId: any, receiverId: any) => {
            const selectedUser = selectedUserRef.current;
            console.log("ackno seen", senderId, receiverId, selectedUser);
            if (selectedUser && selectedUser._id === receiverId) {
                getMessages(selectedUser, "ack");
            }
        };

        socket.on("message", handleNewMessage);
        socket.on("online-user", handleOnlineUsers);
        socket.on("seen-ack-to-sender", handleSeenAckToSender);

        return () => {
            socket.off("message", handleNewMessage);
            socket.off("online-user", handleOnlineUsers);
            socket.off("seen-ack-to-sender", handleSeenAckToSender);
        };
    }, [triggerOnGetMessage]);

    const getConversationWithUsers = (currentUserId: string | null) => {
        if (!currentUserId) {
            return;
        }
        axios.get(`api/conversation/get-count/${currentUserId}`)
            .then((res) => {
                setConversationWithUsers(res.data.conversation);
            })
            .catch((error) => {
                console.error("error", error);
            });
    };

    const getCurrentUserDetails = (currentUserId: string | null) => {
        if (!currentUserId) {
            return;
        }
        axios.get(`api/user/get-by-id/${currentUserId}`)
            .then((res) => {
                console.log("api/user/get-by-id", res);
                setCurrentUser(res.data.user);
            })
            .catch((error) => {
                console.error("error", error);
            });
    };

    useEffect(() => {
        const messageList = document.getElementById('message-list');
        console.log("messageList", messageList?.scrollHeight);
        if (messageList && messages.length > 0) {
            messageList.scrollTo({ behavior: 'instant', top: messageList.scrollHeight });
        }
    }, [messages]);

    const getMessages = (user: any, type: "select" | "ack") => {
        axios.post("api/conversation/get-by-id-chat", { msgSentBy: currentUser._id, msgSentTo: user._id })
            .then((res) => {
                console.log("api/conversation/get-by-id-chat", res);
                setMessages(res.data.conversation?.messages || []);
                if (type === "select" && (currentUser._id !== user._id)) {
                    socket.emit("seen-ack", user._id, currentUser._id);
                    getConversationWithUsers(currentUser._id);
                }
            })
            .catch((error) => {
                console.error("error", error);
            });
    };

    const sendMessage = async () => {
        socket.emit("send-message", currentUser._id, selectedUser?._id, currentMsg);
        setCurrentMsg('');
    };

    const handleSelectUser = (user: { _id: string, name: string }) => {
        setSelectedUser(user);
        getMessages(user, "select");
    };

    const handleSearchUser = (event: any) => {
        const { value }: { value: string } = event.target;
        setSearchUser(value);
        axios.get(`api/user/get-all?search=${value}`)
            .then((res) => {
                setUsers(res.data);
            })
            .catch((error) => {
                console.error("error", error);
            });
    };

    const startChatWithUser = (user: any) => {
        handleSelectUser({ name: user.name, _id: user._id });
        setConversationWithUsers((prev) => [
            ...prev,
            { ...user, name: user.name, userId: user._id }
        ]);
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
                            onChange={handleSearchUser}
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
                        const conversationTime = new Date(conversation.lastmessage.updatedAt).toLocaleTimeString([], { timeStyle: 'short' });

                        return <div key={conversation._id} onClick={() => handleSelectUser({ name: conversation.name, _id: conversation.userId })}
                            className="flex flex-row py-4 px-2 justify-center items-center border-b-2"
                        >
                            <div className="w-20">
                                <img
                                    src="https://eu.ui-avatars.com/api/?name=John+Doe&size=250"
                                    className="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                />
                                <div className={`${onlineUsers.includes(conversation.userId) ? "online" : "offline"} userStatus`}></div>
                            </div>
                            <div className="w-9/12 text-left">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{conversation.name} {conversation.unseen ? ` (${conversation.unseen})` : null}</span>
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{conversationTime}</span>
                                </div>
                                <span className="text-gray-500 truncate block">{conversation.lastmessage?.text}</span>
                            </div>
                        </div>
                    })}
                </div>
                <div className="w-full px-5 flex flex-col justify-between">
                    {selectedUser && selectedUser?._id ? <>
                        <div className="text-lg font-semibold">{selectedUser?.name}</div>
                        <div className="flex flex-col mt-5 max-h-64 overflow-y-auto" id="message-list">
                            {messages.length ? messages.map((msg) => {
                                const msgTime = new Date(msg.updatedAt).toLocaleTimeString([], { timeStyle: 'short' });
                                return <React.Fragment key={msg._id}>
                                    {msg.receiverId !== selectedUser._id ?
                                        <div className="flex justify-start mb-4">
                                            <img
                                                src="https://eu.ui-avatars.com/api/?name=John+Doe&size=250"
                                                className="object-cover h-8 w-8 rounded-full"
                                                alt=""
                                            />
                                            <div
                                                className="max-w-lg w-full overflow-auto break-words whitespace-normal text-left ml-2 py-3 px-4 bg-gray-200 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                                            >
                                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedUser.name}</span>
                                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{msgTime}</span>
                                                </div>
                                                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{msg.text}</p>
                                            </div>
                                        </div>
                                        :
                                        <div className="flex justify-end mb-4">
                                            <div
                                                className="max-w-lg w-full overflow-auto break-words whitespace-normal text-left mr-2 py-3 px-4 bg-blue-200 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                            >
                                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.name}</span>
                                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{msgTime}</span>
                                                </div>
                                                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{msg.text}</p>
                                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{msg.seen ? "seen" : "unseen"}</span>
                                            </div>
                                            <img
                                                src="https://eu.ui-avatars.com/api/?name=John+Doe&size=250"
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