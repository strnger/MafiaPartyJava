package com.yourproject.controller;

import com.yourproject.model.Game;
import com.yourproject.model.Player;
import com.yourproject.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/player")
public class PlayerController {
    @Autowired
    private GameService gameService;

    @GetMapping("/{roomCode}/{playerId}")
    public ResponseEntity<Player> getPlayer(@PathVariable String playerId,
                                            @PathVariable String roomCode) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            Player player = game.getPlayer(playerId);
            return ResponseEntity.ok(player);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{roomCode}/{playerId}/lastWill")
    public ResponseEntity<Void> saveLastWill(@PathVariable String playerId,
                                             @PathVariable String roomCode,
                                             @RequestBody String lastWill) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            game.saveLastWill(playerId, lastWill);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}