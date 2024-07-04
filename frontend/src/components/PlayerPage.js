import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PlayerPage = () => {
  const [lastWill, setLastWill] = useState('');
  const [role, setRole] = useState({});
  const [hasLife, setHasLife] = useState(false);
  const [isRoleRevealed, setIsRoleRevealed] = useState(false);
  const location = useLocation();
  const roomCode = new URLSearchParams(location.search).get('roomCode');
  const playerId = new URLSearchParams(location.search).get('playerId'); // Get playerId from URL
  const playerName = new URLSearchParams(location.search).get('playerName'); // Get playerName from URL
  const baseURL = window.location.origin.replace(':3000', ':8080');

  useEffect(() => {
    console.log('PlayerName from URL:', playerName);

    axios.get(`${baseURL}/api/player/${roomCode}/${playerId}`)
      .then(response => {
        const playerData = response.data;
        setRole(playerData.role);
        setLastWill(playerData.lastWill);
        setHasLife(playerData.hasLife);

        axios.post(`${baseURL}/api/player/${roomCode}/${playerId}/lastWill`, { lastWill: "Will" })
          .then(() => {
            console.log('Initial last will saved successfully');
            setLastWill("Will");
          })
          .catch(error => {
            console.error('Error saving initial last will:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching player data:', error);
      });
  }, [playerId, baseURL, roomCode, playerName]);

  const revealRole = () => {
    console.log(`Revealing role for player ID: ${playerId}`);
    setIsRoleRevealed(true);

    setTimeout(() => {
      setIsRoleRevealed(false);
    }, 5000);
  };

  const saveLastWill = () => {
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
    <Container style={{ padding: '20px' }}>
      <Typography variant="h4">Player: {playerName}</Typography>
      <Button onClick={revealRole} variant="contained" color="primary" disabled={isRoleRevealed}>
        {isRoleRevealed ? `Role: ${role.title}` : 'Reveal Role'}
      </Button>
      {isRoleRevealed && (
        <div>
          <Typography variant="body1">Role Objective: {role.objective}</Typography>
          <Typography variant="body1">Role Description: {role.description}</Typography>
        </div>
      )}
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
      <Button onClick={saveLastWill} variant="contained" color="primary" disabled={!hasLife}>
        Save Last Will
      </Button>
    </Container>
  );
};

export default PlayerPage;
