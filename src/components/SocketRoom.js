import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// const socket = io.connect("https://server-teal-two.vercel.app/");
// const socket = io.connect("https://server-5-ecru.vercel.app");
const socket = io('https://server-teal-two.vercel.app/', {
  transports: ['websocket', 'polling'],
});

const SocketRoom = () => {
    const [roomId, setRoomId] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`); // Unique user ID

    const joinRoom = () => {
        if (roomId !== "") {
            socket.emit('join_room', roomId);
        }
    };

    const sendMessage = () => {
        if (message !== "") {
            socket.emit('send_message', { roomId, message, senderId: userId });
            setMessage(""); // Clear input field after sending
        }
    };

    useEffect(() => {
        socket.on('receive_message', ({ message, senderId }) => {
            setMessages((prevMessages) => [...prevMessages, { message, senderId, sentByMe: senderId === userId }]);
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('receive_message');
        };
    }, [userId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-80">
                <input
                    type="text"
                    placeholder="Room ID"
                    onChange={(e) => setRoomId(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                />
                <button
                    onClick={joinRoom}
                    className="mb-4 p-2 bg-blue-500 text-white rounded w-full"
                >
                    Join Room
                </button>

                <input
                    type="text"
                    placeholder="Message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    className="mb-4 p-2 border rounded w-full"
                />
                <button
                    onClick={sendMessage}
                    className="mb-4 p-2 bg-green-500 text-white rounded w-full"
                >
                    Send Message
                </button>

                <div className="mt-4   overflow-y-auto h-64">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 mb-2 rounded ${msg.sentByMe ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}
                        >
                            <strong>{msg.sentByMe ? 'You: ' : `User ${msg.senderId}: `}</strong>{msg.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocketRoom;
