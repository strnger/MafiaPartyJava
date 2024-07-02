import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const JoinPage = () => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomCodeParam = params.get('roomCode');
    if (roomCodeParam) {
      setRoomCode(roomCodeParam);
    }
  }, [location]);

  const joinGame = () => {
    axios.post(`http://localhost:8080/api/lobby/join?roomCode=${roomCode}&playerName=${name}`)
      .then(response => {
        const { playerId } = response.data; // Assuming the backend returns the playerId
        // Redirect to the PlayerWaiting page after joining
        navigate(`/PlayerWaiting?roomCode=${roomCode}&playerName=${name}&playerId=${playerId}`);
      })
      .catch(error => {
        console.error('There was an error joining the game!', error);
      });
  };

  return (
    <div>
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
    </div>
  );
};

export default JoinPage;
