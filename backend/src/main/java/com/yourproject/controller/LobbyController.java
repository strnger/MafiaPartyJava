package com.yourproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yourproject.model.Player;
import com.yourproject.service.GameService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lobby")
public class LobbyController {
    @Autowired
    private GameService gameService;

    @PostMapping("/create")
    public ResponseEntity<String> createLobby() {
        String roomCode = gameService.createLobby();
        return ResponseEntity.ok(roomCode);
    }

    @PostMapping("/join")
    public ResponseEntity<Map<String, String>> joinLobby(@RequestParam String roomCode, @RequestParam String playerName) {
        String playerId = gameService.joinLobby(roomCode, new Player(playerName));
        Map<String, String> response = new HashMap<>();
        response.put("playerId", playerId);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/start")
    public ResponseEntity<String> startGame(@RequestParam String roomCode) {
        gameService.startGame(roomCode);
        return ResponseEntity.ok().body("Game started successfully");
    }

    @GetMapping("/{roomCode}/players")
    public ResponseEntity<List<Player>> getPlayers(@PathVariable String roomCode) {
        List<Player> players = gameService.getPlayers(roomCode);
        if (players != null) {
            return ResponseEntity.ok(players);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
