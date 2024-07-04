import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

const TIMER_DURATION = 3; // 3 seconds timer duration

const GamePage = () => {
  const { roomCode } = useParams();
  const [gameState, setGameState] = useState({
    phase: '',
    players: [],
    roomCode: '',
    winners: []
  });
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [isNightPhase, setIsNightPhase] = useState(false);
  const baseURL = window.location.origin.replace(':3000', ':8080');

  useEffect(() => {
    if (roomCode) {
      // Fetch game state
      axios.get(`${baseURL}/api/game?roomCode=${roomCode}`)
        .then(response => {
          if (response.data) {
            console.log('Fetched game state:', response.data); // Debug log
            setGameState(response.data);
            setIsNightPhase(response.data.phase === 'Night');
            setTimer(TIMER_DURATION);

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

  useEffect(() => {
    let timerId;
    if (isNightPhase) {
      console.log('Starting timer for night phase');
      timerId = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            console.log('Timer ended, advancing phase');
            clearInterval(timerId);
            advancePhase();
            return TIMER_DURATION;
          }
          console.log('Timer tick:', prevTimer - 1);
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) {
        console.log('Clearing timer');
        clearInterval(timerId);
      }
    };
  }, [isNightPhase]);

  const advancePhase = () => {
    axios.post(`${baseURL}/api/game/advancePhase?roomCode=${roomCode}`)
      .then(response => {
        if (response.data) {
          console.log('Advanced phase:', response.data); // Debug log
          setGameState(response.data);
          setIsNightPhase(response.data.phase === 'Night');
          setTimer(TIMER_DURATION);

          if (response.data.phase === 'Day') {
            // Fetch fresh game state when Day phase begins
            axios.get(`${baseURL}/api/game?roomCode=${roomCode}`)
              .then(response => {
                if (response.data) {
                  console.log('Fetched fresh game state for Day phase:', response.data); // Debug log
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
        // Refresh game state after executing player
        axios.get(`${baseURL}/api/game?roomCode=${roomCode}`)
          .then(response => {
            if (response.data) {
              console.log('Fetched fresh game state after executing player:', response.data); // Debug log
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

  return (
    <div>
      <h1>{gameState.phase ? gameState.phase : 'Game'}</h1>
      {isNightPhase && <div>Night phase ends in: {timer} seconds</div>}
      <List>
        {gameState.players && gameState.players.map(player => (
          <ListItem key={player.id}> {/* Use player.id as key */}
            <ListItemText primary={player.name} secondary={player.hasLife ? 'Alive' : `Dead (Role: ${player.role}, Last Will: ${player.lastWill})`} />
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
        {isNightPhase ? 'Manual Override' : 'Advance Phase'}
      </Button>
    </div>
  );
};

export default GamePage;
