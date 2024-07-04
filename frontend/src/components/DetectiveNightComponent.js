// src/components/DetectiveNightComponent.js
import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

const DetectiveNightComponent = ({ roomCode, playerId }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get(`${window.location.origin.replace(':3000', ':8080')}/api/game/${roomCode}/getPlayers`)
      .then(response => {
        const alivePlayers = response.data.filter(player => player.hasLife);
        setPlayers(alivePlayers);
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });
  }, [roomCode]);

  const handlePlayerClick = (playerId) => {
    // Handle player click logic here
    console.log(`Detective clicked on player with ID: ${playerId}`);
  };

  return (
    <div>
      <Typography variant="h6">Investigate:</Typography>
      {players.map(player => (
        <Button
          key={player.id}
          variant="contained"
          onClick={() => handlePlayerClick(player.id)}
        >
          {player.name}
        </Button>
      ))}
    </div>
  );
};

export default DetectiveNightComponent;
