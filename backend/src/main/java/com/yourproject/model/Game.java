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

    public List<Player> getPlayers() {
        return players;
    }

    // Getters and setters for roomCode, phase, and winner if needed
}
