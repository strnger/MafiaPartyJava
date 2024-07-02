import React, { useState, useEffect, useRef } from 'react';
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
  const playerId = new URLSearchParams(location.search).get('playerId'); // Get playerId from URL

  const stompClientRef = useRef(null);

  useEffect(() => {
    setName(playerName);

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      stompClient.subscribe(`/topic/startGame/${roomCode}`, () => {
        navigate(`/PlayerPage?playerId=${playerId}`); // Pass playerId when navigating
      });
    }, (error) => {
      console.error('STOMP error:', error);
      setIsConnected(false);
    });

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log('Disconnected from WebSocket server');
          setIsConnected(false);
        });
      }
    };
  }, [navigate, roomCode, playerName, playerId]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (isConnected && stompClientRef.current) {
      const playerUpdate = {
        id: playerId, // Ensure playerId is included in the message
        name: newName
      };
      stompClientRef.current.send(`/app/updatePlayerName/${roomCode}`, {}, JSON.stringify(playerUpdate));
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
