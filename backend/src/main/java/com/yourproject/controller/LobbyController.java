package com.yourproject.controller;

import com.yourproject.model.Game;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yourproject.model.Player;
import com.yourproject.service.GameService;

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
    public ResponseEntity<Player> joinLobby(@RequestParam String roomCode, @RequestParam String playerName) {
        Player player = gameService.joinLobby(roomCode, new Player(playerName));
        return ResponseEntity.ok(player);
    }


    @PostMapping("/{roomCode}/start")
    public ResponseEntity<Game> startGame(@PathVariable String roomCode,
                                          @RequestBody Map<String, Integer> roles) {
        Game game = gameService.startGame(roomCode, roles);
        return ResponseEntity.ok(game);
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
