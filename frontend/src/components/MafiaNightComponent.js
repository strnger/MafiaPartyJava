import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, TextField, Box } from '@mui/material';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const MafiaNightComponent = ({ roomCode, playerId, playerName }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);
  const baseURL = window.location.origin.replace(':3000', ':8080');

  useEffect(() => {
    axios.get(`${baseURL}/api/game/${roomCode}/getPlayers`)
      .then(response => {
        const nonMafiaPlayers = response.data.filter(player => player.role.allegiance !== 'Mafia' && player.hasLife);
        setPlayers(nonMafiaPlayers);
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });

    const connectStompClient = () => {
      const socket = new SockJS(`${baseURL}/ws`);
      const stompClient = Stomp.over(() => socket);
      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
        setIsConnected(true);

        stompClient.subscribe(`/topic/mafiaVoteUpdate/${roomCode}`, (message) => {
          setChatHistory(prev => [...prev, message.body]);
        });

        stompClient.subscribe(`/topic/mafiaChat/${roomCode}`, (message) => {
          setChatHistory(prev => [...prev, message.body]);
        });
      }, (error) => {
        console.error('STOMP connection error:', error);
        setIsConnected(false);
      });
    };

    connectStompClient();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          setIsConnected(false);
        });
      }
    };
  }, [roomCode, baseURL]);

  const handlePlayerClick = (targetId, targetName) => {
    setSelectedPlayer(targetId);
    const voteMessage = {
      playerId,
      playerName,
      targetId,
      targetName
    };
    if (isConnected && stompClientRef.current) {
      stompClientRef.current.send(`/app/mafiaVote/${roomCode}`, {}, JSON.stringify(voteMessage));
    } else {
      console.error('STOMP client is not connected');
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() && isConnected && stompClientRef.current) {
      const chatMessageObj = {
        playerId,
        playerName,
        message: chatMessage
      };
      stompClientRef.current.send(`/app/mafiaChat/${roomCode}`, {}, JSON.stringify(chatMessageObj));
      setChatMessage('');
    } else {
      console.error('Cannot send message: STOMP client is not connected or message is empty');
    }
  };

  return (
    <div>
      <Typography variant="h6">Mafia Chat:</Typography>
      <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', padding: 1, borderRadius: 4 }}>
        {chatHistory.slice(-7).map((message, index) => (
          <Typography key={index} variant="body2">{message}</Typography>
        ))}
      </Box>
      <TextField
        label="Type a message"
        value={chatMessage}
        onChange={e => setChatMessage(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button onClick={handleSendMessage} variant="contained" color="primary">
        Send
      </Button>
      <Typography variant="h6">Select a player to kill:</Typography>
      {players.map(player => (
        <Button
          key={player.id}
          variant="contained"
          onClick={() => handlePlayerClick(player.id, player.name)}
          disabled={selectedPlayer === player.id}
        >
          {selectedPlayer === player.id ? `Selected ${player.name}` : player.name}
        </Button>
      ))}
    </div>
  );
};

export default MafiaNightComponent;
