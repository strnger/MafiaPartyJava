package com.yourproject.model;

import java.util.ArrayList;
import java.util.List;

public class Game {
    private String roomCode;
    private List<Player> players = new ArrayList<>();
    private String phase;
    private String winner;

    public Game(String roomCode) {
        this.roomCode = roomCode;
        this.phase = "Lobby";
    }

    public void addPlayer(Player player) {
        for (Player p : players) {
            if (p.getId().equals(player.getId())) {
                throw new IllegalArgumentException("Non-unique player ID: " + player.getId());
            }
        }
        players.add(player);
    }

    public void start() {
        assignRoles();
        phase = "Day";
    }

    public void advancePhase() {
        // Logic to advance phase
    }

    private void assignRoles() {
        // Random role assignment logic
    }

    public void updatePlayerName(Player updatedPlayer) {
        for (Player player : players) {
            if (player.getId().equals(updatedPlayer.getId())) {
                player.setName(updatedPlayer.getName());
                return;
            }
        }
        throw new IllegalArgumentException("Player not found: " + updatedPlayer.getId());
    }

    public List<Player> getPlayers() {
        return players;
    }
}
