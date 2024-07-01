import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GamePage = () => {
  const { roomCode } = useParams();
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    // Fetch game state
  }, []);

  const advancePhase = () => {
    axios.post('/api/game/advance', { roomCode })
      .then(() => {
        // Handle phase advancement
      });
  };

  return (
    <div>
      <h1>Game</h1>
      <List>
        {gameState.players && gameState.players.map(player => (
          <ListItem key={player.name}>
            <ListItemText primary={player.name} secondary={player.isAlive ? 'Alive' : `Dead (Role: ${player.role}, Last Will: ${player.lastWill})`} />
          </ListItem>
        ))}
      </List>
      <Button onClick={advancePhase} variant="contained" color="primary">Advance Phase</Button>
    </div>
  );
};

export default GamePage;
