package com.yourproject.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class Game {
    private String roomCode;
    private List<Player> players = new ArrayList<>();
    private String phase;
    private List<Player> winners = new ArrayList<>();

    public Game(@JsonProperty("roomCode") String roomCode,
                @JsonProperty("players") List<Player> players,
                @JsonProperty("phase") String phase,
                @JsonProperty("winners") List<Player> winners) {
        this.roomCode = roomCode;
        this.players = players;
        this.phase = phase;
        this.winners = winners;
    }

    public Game(String roomCode) {
        this.roomCode = roomCode;
        this.phase = "Lobby";
    }

    public void addPlayer(Player player) {
        for (Player p : players) {
            if (p.getId().equals(player.getId())) {
                throw new IllegalArgumentException("Non-unique player ID: " + player.getId());
            }
            if (p.getName().equals(player.getName())) {
                throw new IllegalArgumentException("Non-unique player name: " + player.getName());
            }
        }
        players.add(player);
    }

    public void start() {
        assignRoles();
        phase = "Day";
    }

    public void advancePhase() {
        // Logic to advance phase, for example:
        if ("Day".equals(this.phase)) {
            this.phase = "Night";
        } else if ("Night".equals(this.phase)) {
            this.phase = "Day";
        }
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

    public String getPhase() {
        return phase;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public List<Player> getWinners() {
        return winners;
    }

    public void setWinners(List<Player> winners) {
        this.winners = winners;
    }
}
