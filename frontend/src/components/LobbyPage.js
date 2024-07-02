import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const LobbyPage = () => {
  const { roomCode } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch initial data for the room code
    axios.get(`http://localhost:8080/api/lobby/${roomCode}/players`)
      .then(response => {
        setPlayers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the players!', error);
      });

    // WebSocket connection to get real-time updates
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/lobby/${roomCode}`, (message) => {
        const updatedPlayers = JSON.parse(message.body);
        setPlayers(updatedPlayers); // Set the entire updated player list
      });
    }, (error) => {
      console.error('STOMP error:', error);
    });

    return () => {
      stompClient.disconnect();
    };
  }, [roomCode]);

  const startGame = () => {
    axios.post(`http://localhost:8080/api/lobby/start?roomCode=${roomCode}`)
      .then(() => {
        // Handle game start
      })
      .catch(error => {
        console.error('There was an error starting the game!', error);
      });
  };

  return (
    <div>
      <h1>Lobby</h1>
      <p>Room Code: {roomCode}</p>
      <List>
        {players.map(player => (
          <ListItem key={player.id}>
            <ListItemText primary={player.name} />
          </ListItem>
        ))}
      </List>
      <div>
        {/* Role Configuration UI */}
      </div>
      <Button onClick={startGame} variant="contained" color="primary">Start Game</Button>
    </div>
  );
};

export default LobbyPage;
