package com.yourproject.controller;

import com.yourproject.model.Game;
import com.yourproject.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yourproject.service.GameService;

import java.util.List;

@RestController
@RequestMapping("/api/game")
public class GameController {
    @Autowired
    private GameService gameService;

    @PostMapping("/advancePhase")
    public ResponseEntity<Game> advancePhase(@RequestParam String roomCode) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            gameService.advancePhase(roomCode);
            return ResponseEntity.ok(game);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<Game> getGame(@RequestParam String roomCode) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            return ResponseEntity.ok(game);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{roomCode}/getPhase")
    public ResponseEntity<String> getPhase(@PathVariable String roomCode) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            return ResponseEntity.ok(game.getPhase());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{roomCode}/executePlayer/{playerId}")
    public ResponseEntity<Game> executePlayer(@PathVariable String playerId,
                                              @PathVariable String roomCode) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            game.executePlayer(playerId);
            return ResponseEntity.ok(game);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{roomCode}/getPlayers")
    public ResponseEntity<List<Player>> getPlayers(@PathVariable String roomCode) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            return ResponseEntity.ok(game.getPlayers());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}