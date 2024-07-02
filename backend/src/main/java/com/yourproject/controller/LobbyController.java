package com.yourproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yourproject.model.Player;
import com.yourproject.service.GameService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

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
    public ResponseEntity<Void> joinLobby(@RequestParam String roomCode, @RequestParam String playerName) {
        gameService.joinLobby(roomCode, new Player(playerName));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/start")
    public ResponseEntity<Void> startGame(@RequestParam String roomCode) {
        gameService.startGame(roomCode);
        return ResponseEntity.ok().build();
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
