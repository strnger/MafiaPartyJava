package com.yourproject.model;

import java.util.*;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        this.mafiaVotes = new HashMap<>();
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

    public void start(Map<String, Integer> roles) {
        assignRoles(roles);
        phase = "Day";
    }

    public String advancePhase() {
        // Logic to advance phase, for example:
        if ("Day".equals(this.phase)) {
            this.phase = "Night";
        } else if ("Night".equals(this.phase)) {
            this.phase = "Day";
        }
        return this.phase;
    }

    private void assignRoles(Map<String, Integer> roles) {
        // Create a list of all roles based on the roles map
        List<String> roleList = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : roles.entrySet()) {
            for (int i = 0; i < entry.getValue(); i++) {
                roleList.add(entry.getKey());
            }
        }

        // Shuffle the roles to ensure randomness
        Collections.shuffle(roleList);

        // Assign roles to players
        int i = 0;
        for (Player player : players) {
            if (i < roleList.size()) {
                player.setRole(roleList.get(i));
            } else {
                player.setRole("Generic Town");
            }
            i++;
        }
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

    public void saveLastWill(String playerId, String lastWill) {
        this.getPlayers()
                .stream()
                .filter(p -> p.getId().equals(playerId) && p.isHasLife())
                .findFirst()
                .ifPresent(p -> p.setLastWill(lastWill));
    }

    //todo - simplify the kill logic
    public void executePlayer(String playerIdToKill) {
        this.getPlayers()
                .stream()
                .filter(p -> p.getId().equals(playerIdToKill) && p.isHasLife())
                .findFirst()
                .ifPresent(p -> {
                    p.setHasLife(false);
                    p.setKiller("Executed", "irrelevant");
                });
    }

    public void murderPlayer(String victimPlayerId, String murdererPlayerId, String roomCode ) {
        String roleOfKiller = this.getPlayer(murdererPlayerId).getRole().getTitle();

        this.getPlayers()
                .stream()
                .filter(p -> p.getId().equals(victimPlayerId) && p.isHasLife())
                .findFirst()
                .ifPresent(p -> {
                    p.setHasLife(false);
                    p.setKiller(murdererPlayerId, roleOfKiller);
                });
    }


    public Player getPlayer(String playerId) {
        for (Player player : players) {
            if (player.getId().equals(playerId)) {
                return player;
            }
        }
        return null;
    }



    //todo cleanup


    private Map<String, String> mafiaVotes; // playerId -> targetId

    String mafioso;


    public void addMafiaVote(String playerId, String targetId) {
        mafiaVotes.put(playerId, targetId);
    }

    public String getMafiaVoteResult() {
        Map<String, Long> voteCount = mafiaVotes.values().stream()
                .collect(Collectors.groupingBy(v -> v, Collectors.counting()));

        // Find the target with the highest vote count
        Optional<Map.Entry<String, Long>> maxEntry = voteCount.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        if (maxEntry.isPresent()) {
            long maxVotes = maxEntry.get().getValue();
            List<String> topTargets = voteCount.entrySet().stream()
                    .filter(entry -> entry.getValue() == maxVotes)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            String selectedTarget;
            if (topTargets.size() == 1) {
                selectedTarget = topTargets.get(0);
            } else {
                // Randomly select a target if there is a tie
                Random random = new Random();
                selectedTarget = topTargets.get(random.nextInt(topTargets.size()));
            }

            // Set mafioso as one of the players who voted for the selected target
            setMafioso(mafiaVotes.entrySet().stream()
                    .filter(entry -> entry.getValue().equals(selectedTarget))
                    .map(Map.Entry::getKey)
                    .findAny()
                    .orElse(null));

            return selectedTarget;
        } else {
            return null; // No votes cast
        }
    }

    public String getMafioso() {
        return mafioso;
    }

    public void setMafioso(String mafioso) {
        this.mafioso = mafioso;
    }

    public Map<String, String> getMafiaVotes() {
        return mafiaVotes;
    }

    public void clearMafiaVotes() {
        mafiaVotes.clear();
    }
}