import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const JoinPage = () => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const baseURL = window.location.origin.replace(':3000', ':8080');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomCodeParam = params.get('roomCode');
    if (roomCodeParam) {
      setRoomCode(roomCodeParam);
    }
  }, [location]);

  const joinGame = () => {
    axios.post(`${baseURL}/api/lobby/join?roomCode=${roomCode}&playerName=${name}`)
      .then(response => {
        const { id, name, role, lastWill, hasLife } = response.data;
        navigate(`/PlayerWaiting?roomCode=${roomCode}&playerId=${id}&playerName=${name}&role=${role}&lastWill=${lastWill}&hasLife=${hasLife}`);
      })
      .catch(error => {
        console.error('There was an error joining the game!', error);
      });
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h4">Join Game</Typography>
      <TextField
        label="Room Code"
        value={roomCode}
        onChange={e => setRoomCode(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button onClick={joinGame} variant="contained" color="primary">Join</Button>
    </Container>
  );
};

export default JoinPage;
