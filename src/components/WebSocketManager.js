import React, { useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAppContext } from './contexts/AppContext';

const WebSocketManager = () => {
  const [state, setState] = useAppContext();
  const socketRef = useRef(null);

  const connectSocketIO = () => {
    socketRef.current = io(process.env.REACT_APP_API_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO");
      setState(prevState => ({ ...prevState, socket: socketRef.current }));
    });

    socketRef.current.on("message", (message) => {
      console.log("Received message:", message);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket.IO Error:", error);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from Socket.IO");
      setTimeout(connectSocketIO, 5000);
    });
  };

  useEffect(() => {
    if (state.session) {
      connectSocketIO();
    }
    return () => {
      if (socketRef.current) {
        // socketRef.current.disconnect();
      }
    };
  }, [state.session]);

  return null;
};

export default WebSocketManager;
