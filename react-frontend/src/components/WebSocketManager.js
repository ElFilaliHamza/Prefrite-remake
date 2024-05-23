import React, { useEffect } from 'react';
import { useAppContext } from './AppContext';

const WebSocketManager = () => {
  const [state, setState] = useAppContext();

  useEffect(() => {
    if (state.session) {
      const ws = new WebSocket('wss://your-websocket-url');

      ws.onopen = () => {
        console.log('Connected to WebSocket');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // Handle incoming WebSocket messages
        console.log('Received message:', message);
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket');
      };

      return () => {
        ws.close();
      };
    }
  }, [state.session]);

  return null;
};

export default WebSocketManager;
