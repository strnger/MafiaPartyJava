import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

export const socket = new Client({
  brokerURL: 'ws://localhost:8080/ws', // Ensure this is correct
  reconnectDelay: 5000, // Attempt to reconnect every 5 seconds
});

const WebSocketClient = ({ onMessage }) => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.onConnect = () => {
      console.log('Connected to WebSocket server');
      socket.subscribe('/topic/messages', (message) => {
        onMessage(JSON.parse(message.body));
      });

      socket.subscribe('/topic/startGame', () => {
        navigate('/PlayerPage');
      });
    };

    socket.onDisconnect = () => {
      console.log('Disconnected from WebSocket server');
    };

    socket.activate();

    return () => {
      socket.deactivate();
    };
  }, [onMessage, navigate]);

  return null;
};

export default WebSocketClient;
