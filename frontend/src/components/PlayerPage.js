import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PlayerPage = () => {
  const [lastWill, setLastWill] = useState('');
  const [role, setRole] = useState('');
  const [isRoleRevealed, setIsRoleRevealed] = useState(false);
  const location = useLocation();
  const roomCode = new URLSearchParams(location.search).get('roomCode');
  const playerId = new URLSearchParams(location.search).get('playerId'); // Get playerId from URL
  const playerName = new URLSearchParams(location.search).get('playerName'); // Get playerName from URL
  const baseURL = window.location.origin.replace(':3000', ':8080');

  useEffect(() => {
    // Fetch player's initial state
    axios.get(`${baseURL}/api/player/${playerId}`)
      .then(response => {
        const playerData = response.data;
        setRole(playerData.role);
        setLastWill(playerData.lastWill);
      })
      .catch(error => {
        console.error('Error fetching player data:', error);
      });
  }, [playerId, baseURL]);

  const revealRole = () => {
    // Logic to reveal role
    console.log(`Revealing role for player ID: ${playerId}`);
    setIsRoleRevealed(true);
  };

  const saveLastWill = () => {
    // Logic to save last will
    console.log(`Saving last will for player ID: ${playerId}`);
    axios.post(`${baseURL}/api/player/${roomCode}/${playerId}/lastWill`, { lastWill })
      .then(() => {
        console.log('Last will saved successfully');
      })
      .catch(error => {
        console.error('Error saving last will:', error);
      });
  };

  return (
    <div>
      <Typography variant="h4">Player: {playerName}</Typography>
      <Button onClick={revealRole} variant="contained" color="primary" disabled={isRoleRevealed}>
        {isRoleRevealed ? `Role: ${role}` : 'Reveal Role'}
      </Button>
      <TextField
        label="Last Will"
        value={lastWill}
        onChange={e => setLastWill(e.target.value)}
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button onClick={saveLastWill} variant="contained" color="primary">
        Save Last Will
      </Button>
    </div>
  );
};

export default PlayerPage;
