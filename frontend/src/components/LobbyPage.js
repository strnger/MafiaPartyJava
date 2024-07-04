import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText, Container, Grid, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const LobbyPage = () => {
  const { roomCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState({ Mafia: 1, Detective: 1, Judge: 1 });
  const baseURL = window.location.origin;
  const baseURL8080 = window.location.origin.replace(':3000', ':8080');
  const navigate = useNavigate();

  useEffect(() => {

    axios.get(`${baseURL}/api/lobby/${roomCode}/players`)
      .then(response => {
        setPlayers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the players!', error);
      });

    const socket = new SockJS(`${baseURL8080}/ws`);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/lobby/${roomCode}`, (message) => {
        const updatedPlayers = JSON.parse(message.body).players;
        setPlayers(updatedPlayers);
      });
    }, (error) => {
      console.error('STOMP error:', error);
    });

    return () => {
      stompClient.disconnect();
    };
  }, [roomCode]);

  const startGame = () => {
    console.log('Starting game with roles:', roles);
    axios.post(`${baseURL8080}/api/lobby/${roomCode}/start`, roles)
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

  const handleRoleChange = (role, increment) => {
    setRoles(prevRoles => {
      const newCount = (prevRoles[role] || 0) + increment;
      if (newCount >= 0 && newCount <= 10) {
        return { ...prevRoles, [role]: newCount };
      }
      return prevRoles;
    });
  };

  const joinURL = `${baseURL}/join?roomCode=${roomCode}`;

  return (
    <Container style={{ padding: '20px' }}>
      <h1>Lobby</h1>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={6}>
           <p>Room Code: {roomCode}</p>
           <QRCode value={joinURL} /> {/* Update QRCode component */}
          <div>
          <Button onClick={startGame} variant="contained" color="primary">Start Game</Button>
            {Object.keys(roles).map(role => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                <Typography>{role}:</Typography>
                <IconButton onClick={() => handleRoleChange(role, -1)}><Remove /></IconButton>
                <Typography>{roles[role]}</Typography>
                <IconButton onClick={() => handleRoleChange(role, 1)}><Add /></IconButton>
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={6}>
          <List>
            {players.map(player => (
              <ListItem key={player.id}>
                <ListItemText primary={player.name} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LobbyPage;
