import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText, Container } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const GamePage = () => {
  const { roomCode } = useParams();
  const [gameState, setGameState] = useState({
    phase: '',
    players: [],
    roomCode: '',
    winners: []
  });
  const baseURL = window.location.origin.replace(':3000', ':8080');

  useEffect(() => {
    if (roomCode) {
      // Fetch game state
      axios.get(`${baseURL}/api/game?roomCode=${roomCode}`)
        .then(response => {
          if (response.data) {
            console.log('Fetched game state:', response.data); // Debug log
            setGameState(response.data);

            // Navigate players if the game state is active
            if (response.data.phase !== '') {
              const socket = new SockJS(`${baseURL}/ws`);
              const stompClient = Stomp.over(socket);

              stompClient.connect({}, () => {
                stompClient.send(`/app/startGame/${roomCode}`, {}, JSON.stringify({ roomCode }));
              });
            }
          }
        })
        .catch(error => {
          console.error('Error fetching game state:', error);
        });
    }
  }, [roomCode]);

  const advancePhase = () => {
    axios.post(`${baseURL}/api/game/advancePhase?roomCode=${roomCode}`)
      .then(response => {
        if (response.data) {
          console.log('Advanced phase:', response.data);
          setGameState(response.data);

          if (response.data.phase === 'Day') {
            axios.get(`${baseURL}/api/game?roomCode=${roomCode}`)
              .then(response => {
                if (response.data) {
                  console.log('Fetched fresh game state for Day phase:', response.data);
                  setGameState(response.data);
                }
              })
              .catch(error => {
                console.error('Error fetching fresh game state:', error);
              });
          }
        }
      })
      .catch(error => {
        console.error('Error advancing phase:', error);
      });
  };

  const executePlayer = (playerId) => {
    axios.post(`${baseURL}/api/game/${roomCode}/executePlayer/${playerId}`)
      .then(() => {
        axios.get(`${baseURL}/api/game?roomCode=${roomCode}`)
          .then(response => {
            if (response.data) {
              console.log('Fetched fresh game state after executing player:', response.data);
              setGameState(response.data);
            }
          })
          .catch(error => {
            console.error('Error fetching fresh game state:', error);
          });
      })
      .catch(error => {
        console.error('Error executing player:', error);
      });
  };

  const parseWill = (lastWill) => {
    if (!lastWill) {
      return 'No will';
    }

    try {
      const parsedWill = JSON.parse(lastWill);
      return parsedWill.lastWill || 'No will';
    } catch (error) {
      return 'No will';
    }
  };

  return (
    <Container style={{ padding: '20px' }}>
      <h1>{gameState.phase}</h1>
      <List>
        {gameState.players && gameState.players.map(player => (
          <ListItem key={player.id} style={{ display: 'flex', alignItems: 'center' }}>
            <ListItemText
              primary={player.name}
              secondary={
                player.hasLife
                  ? 'Alive'
                  : `Killed by ${player.killer.roleOfKiller} - Role: ${player.role.title} - Last Will: ${parseWill(player.lastWill)}`
              }
            />
            {player.hasLife && (
              <Button
                onClick={() => executePlayer(player.id)}
                variant="contained"
                color="secondary"
                style={{ marginLeft: '10px' }}
              >
                Execute
              </Button>
            )}
          </ListItem>
        ))}
      </List>
      <Button
        onClick={advancePhase}
        variant="contained"
        color="primary"
      >
        Advance Phase
      </Button>
    </Container>
  );
};

export default GamePage;
