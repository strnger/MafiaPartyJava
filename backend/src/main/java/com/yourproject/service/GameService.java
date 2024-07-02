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

    public String joinLobby(String roomCode, Player player) {
        Game game = games.get(roomCode);
        if (game != null && player != null) {
            game.addPlayer(player);
            notifyLobby(player.getName());
            return player.getId();
        } else {
            throw new IllegalArgumentException("Invalid room code or player");
        }
    }

    public void startGame(String roomCode) {
        Game game = games.get(roomCode);
        if (game != null) {
            game.start();
        }
    }

    public void advancePhase(String roomCode) {
        Game game = games.get(roomCode);
        if (game != null) {
            game.advancePhase();
        }
    }

    public List<Player> getPlayers(String roomCode) {
        Game game = games.get(roomCode);
        if (game != null) {
            return game.getPlayers();
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
            messagingTemplate.convertAndSend("/topic/lobby/" + roomCode, game.getPlayers());
        }
    }
}
