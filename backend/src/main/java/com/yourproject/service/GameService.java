package com.yourproject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.yourproject.model.Game;
import com.yourproject.model.Player;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {
    private Map<String, Game> games = new ConcurrentHashMap<>();

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public String createLobby() {
        String roomCode = generateRoomCode();
        games.put(roomCode, new Game(roomCode));
        return roomCode;
    }

    public Player joinLobby(String roomCode, Player player) {
        Game game = games.get(roomCode);
        if (game != null && player != null) {
            game.addPlayer(player);
            notifyLobby(roomCode);
            return player;
        } else {
            throw new IllegalArgumentException("Invalid room code or player");
        }
    }

    public Game startGame(String roomCode, Map<String, Integer> roles) {
        Game game = games.get(roomCode);
        if (game != null) {
            game.start(roles);
            return game;
        }
        return null;
    }

    public String advancePhase(String roomCode) {
        Game game = games.get(roomCode);
        if (game != null) {
            String phase = game.advancePhase();
            if(phase.equals("Day")){

                //handle mafia killing
                String mafiaMurderTarget = game.getMafiaVoteResult();
                if(mafiaMurderTarget != null) {
                    game.murderPlayer(mafiaMurderTarget, game.getMafioso(), roomCode);
                    game.clearMafiaVotes();
                }

            }


            messagingTemplate.convertAndSend("/topic/gamePhaseUpdate/" + roomCode, game);
            return phase;
        }
        return null;
    }

    public String getPhase(String roomCode) {
        Game game = games.get(roomCode);
        if (game != null) {
            return game.getPhase();
        }
        return null;
    }

    public List<Player> getPlayers(String roomCode) {
        Game game = games.get(roomCode);
        if (game != null) {
            return game.getPlayers();
        }
        return null;
    }

    public Game getGame(String roomCode) {
        Game game = games.get(roomCode);
        if (game != null) {
            return game;
        }
        return null;
    }

    private String generateRoomCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    public void updatePlayerName(String roomCode, Player player) {
        Game game = games.get(roomCode);
        if (game != null) {
            game.updatePlayerName(player);
            notifyLobby(roomCode); // Notify the lobby about the updated player list
        } else {
            throw new IllegalArgumentException("Invalid room code");
        }
    }

    private void notifyLobby(String roomCode) {
        Game game = games.get(roomCode);
        if (game != null) {
            messagingTemplate.convertAndSend("/topic/lobby/" + roomCode, game);
        }
    }
}
