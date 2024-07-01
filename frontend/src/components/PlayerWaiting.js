import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const PlayerWaiting = () => {
  const [name, setName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const roomCode = new URLSearchParams(location.search).get('roomCode');
  const playerName = new URLSearchParams(location.search).get('playerName');

  useEffect(() => {
    setName(playerName);

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      stompClient.subscribe(`/topic/startGame/${roomCode}`, () => {
        navigate('/PlayerPage');
      });
    }, (error) => {
      console.error('STOMP error:', error);
      setIsConnected(false);
    });

    return () => {
      stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });
    };
  }, [navigate, roomCode, playerName]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (isConnected) {
      const socket = new SockJS('http://localhost:8080/ws');
      const stompClient = Stomp.over(socket);
      stompClient.send(`/app/updatePlayerName/${roomCode}`, {}, JSON.stringify({ playerName: e.target.value }));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <div>
      <h1>Waiting for the host to start the game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={handleNameChange}
      />
      {!isConnected && <p>Connecting to server...</p>}
    </div>
  );
};

export default PlayerWaiting;
