import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

const CreateLobbyPage = () => {
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    axios.post('http://localhost:8080/api/lobby/create')
      .then(response => {
        setRoomCode(response.data);
      })
      .catch(error => {
        console.error('There was an error creating the lobby!', error);
      });
  }, []);

  return (
    <div>
      <Typography variant="h4">Lobby Created</Typography>
      <Typography variant="h6">Room Code: {roomCode}</Typography>
      <Button href={`/lobby/${roomCode}`} variant="contained" color="primary">Go to Lobby</Button>
    </div>
  );
};

export default CreateLobbyPage;
