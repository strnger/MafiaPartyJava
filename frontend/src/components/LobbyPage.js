import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText, Container } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import QRCode from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';

const LobbyPage = () => {
  const { roomCode } = useParams();
  const [players, setPlayers] = useState([]);
  const baseURL = window.location.origin; // Get the base URL
  const baseURL8080 = window.location.origin.replace(':3000', ':8080');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial data for the room code
    axios.get(`${baseURL}/api/lobby/${roomCode}/players`)
      .then(response => {
        setPlayers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the players!', error);
      });

    // WebSocket connection to get real-time updates
    const socket = new SockJS(`${baseURL8080}/ws`);
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
    axios.post(`${baseURL8080}/api/lobby/start?roomCode=${roomCode}`)
      .then(() => {
        const socket = new SockJS(`${baseURL8080}/ws`);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
          stompClient.send(`/app/startGame/${roomCode}`, {}, JSON.stringify({ roomCode }));
        });

        navigate(`/game/${roomCode}`);
      })
      .catch(error => {
        console.error('There was an error starting the game!', error);
      });
  };


  const joinURL = `${baseURL}/join?roomCode=${roomCode}`; // Construct the join URL

  return (
    <Container style={{ padding: '20px' }}>
      <h1>Lobby</h1>
      <p>Room Code: {roomCode}</p>
      <QRCode value={joinURL} /> {/* Update QRCode component */}
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
    </Container>
  );
};

export default LobbyPage;
