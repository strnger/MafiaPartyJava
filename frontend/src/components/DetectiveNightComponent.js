import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

const DetectiveNightComponent = ({ roomCode, playerId }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [investigatingPlayer, setInvestigatingPlayer] = useState('');

  useEffect(() => {
    axios.get(`${window.location.origin.replace(':3000', ':8080')}/api/game/${roomCode}/getPlayers`)
      .then(response => {
        const alivePlayers = response.data.filter(player => player.hasLife && player.id !== playerId);
        setPlayers(alivePlayers);
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });
  }, [roomCode, playerId]);

  const handlePlayerClick = (targetId, targetName) => {
    setSelectedPlayer(targetId);
    setInvestigatingPlayer(targetName);
    axios.post(`${window.location.origin.replace(':3000', ':8080')}/api/playerAction/${roomCode}/${playerId}/detectiveInvestigatePlayer?targetId=${targetId}`)
      .then(response => {
        console.log(`Investigating ${targetName}: ${response.data}`);
      })
      .catch(error => {
        console.error('Error investigating player:', error);
      });
  };

  return (
    <div>
      <Typography variant="h6">Investigate:</Typography>
      {players.map(player => (
        <Button
          key={player.id}
          variant="contained"
          onClick={() => handlePlayerClick(player.id, player.name)}
          disabled={selectedPlayer !== null && selectedPlayer !== player.id}
        >
          {selectedPlayer === player.id ? `Investigating ${player.name}` : player.name}
        </Button>
      ))}
    </div>
  );
};

export default DetectiveNightComponent;
