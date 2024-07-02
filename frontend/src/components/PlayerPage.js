import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';

const PlayerPage = () => {
  const [lastWill, setLastWill] = useState('');
  const location = useLocation();
  const playerId = new URLSearchParams(location.search).get('playerId'); // Get playerId from URL

  const revealRole = () => {
    // Logic to reveal role
    console.log(`Revealing role for player ID: ${playerId}`);
  };

  const saveLastWill = () => {
    // Logic to save last will
    console.log(`Saving last will for player ID: ${playerId}`);
  };

  return (
    <div>
      <h1>Player</h1>
      <Button onClick={revealRole} variant="contained" color="primary">Reveal Role</Button>
      <TextField label="Last Will" value={lastWill} onChange={e => setLastWill(e.target.value)} />
      <Button onClick={saveLastWill} variant="contained" color="primary">Save Last Will</Button>
    </div>
  );
};

export default PlayerPage;
