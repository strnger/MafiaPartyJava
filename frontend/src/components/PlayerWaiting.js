import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { socket } from './WebSocketClient';

const PlayerWaiting = () => {
  const [name, setName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const roomCode = new URLSearchParams(location.search).get('roomCode');
  const playerName = new URLSearchParams(location.search).get('playerName');

  useEffect(() => {
    setName(playerName);

    socket.onConnect = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      socket.subscribe(`/topic/startGame/${roomCode}`, () => {
        navigate('/PlayerPage');
      });
    };

    socket.onDisconnect = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    };

    socket.activate();

    return () => {
      socket.deactivate();
    };
  }, [navigate, roomCode, playerName]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (isConnected) {
      socket.publish({
        destination: `/app/updatePlayerName/${roomCode}`,
        body: JSON.stringify({ playerName: e.target.value }),
      });
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
