import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

const PlayerPage = () => {
  const [lastWill, setLastWill] = useState('');

  const revealRole = () => {
    // Logic to reveal role
  };

  const saveLastWill = () => {
    // Logic to save last will
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
