import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import DetectiveNightComponent from './DetectiveNightComponent';
import MafiaNightComponent from './MafiaNightComponent';

const PlayerPage = () => {
  const [lastWill, setLastWill] = useState('');
  const [role, setRole] = useState({});
  const [hasLife, setHasLife] = useState(false);
  const [isRoleRevealed, setIsRoleRevealed] = useState(false);
  const [gamePhase, setGamePhase] = useState('');
  const [investigationResult, setInvestigationResult] = useState(null);
  const location = useLocation();
  const roomCode = new URLSearchParams(location.search).get('roomCode');
  const playerId = new URLSearchParams(location.search).get('playerId');
  const playerName = new URLSearchParams(location.search).get('playerName');
  const baseURL = window.location.origin.replace(':3000', ':8080');

  useEffect(() => {
    console.log('PlayerName from URL:', playerName);

    axios.get(`${baseURL}/api/player/${roomCode}/${playerId}`)
      .then(response => {
        const playerData = response.data;
        setRole(playerData.role);
        setLastWill(playerData.lastWill);
        setHasLife(playerData.hasLife);
      })
      .catch(error => {
        console.error('Error fetching player data:', error);
      });

    const socket = new SockJS(`${baseURL}/ws`);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log('WebSocket connected');
      stompClient.subscribe(`/topic/gamePhaseUpdate/${roomCode}`, (message) => {
        const updatedPhase = JSON.parse(message.body).phase;
        console.log('Received game phase update:', updatedPhase);
        setGamePhase(updatedPhase);
        if (updatedPhase === 'Day' && role.title === 'Detective') {
          axios.get(`${baseURL}/api/playerAction/${roomCode}/${playerId}/investigationResult`)
            .then(response => {
              setInvestigationResult(response.data);
              alert(`Investigation Result: ${response.data}`);
            })
            .catch(error => {
              console.error('Error fetching investigation result:', error);
            });
        }
      }, (error) => {
        console.error('Error subscribing to game phase updates:', error);
      });
    }, (error) => {
      console.error('STOMP connection error:', error);
    });

    return () => {
      stompClient.disconnect(() => {
        console.log('WebSocket disconnected');
      });
    };
  }, [playerId, baseURL, roomCode, playerName, role.title]);

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
      <Typography variant="h6">Current Phase: {gamePhase || "First day"}</Typography>
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
      {role.title === 'Detective' && gamePhase === 'Night' && (
        <DetectiveNightComponent roomCode={roomCode} playerId={playerId} />
      )}
      {role.allegiance === 'Mafia' && gamePhase === 'Night' && (
        <MafiaNightComponent roomCode={roomCode} playerId={playerId} playerName={playerName} />
      )}
    </Container>
  );
};

export default PlayerPage;
