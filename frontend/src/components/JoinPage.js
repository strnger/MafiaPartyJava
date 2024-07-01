import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JoinPage = () => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const joinGame = () => {
    axios.post(`http://localhost:8080/api/lobby/join?roomCode=${roomCode}&playerName=${name}`)
      .then(() => {
        // Redirect to the PlayerWaiting page after joining
        navigate(`/PlayerWaiting?roomCode=${roomCode}&playerName=${name}`);
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
