import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const socketInstance = io('http://localhost:8000');
    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinStory = (storyId) => {
    if (socket) {
      socket.emit('join_story', storyId);
    }
  };

  return { socket, joinStory };
};