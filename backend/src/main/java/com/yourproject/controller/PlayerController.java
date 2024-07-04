package com.yourproject.controller;

import com.yourproject.model.Game;
import com.yourproject.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/player")
public class PlayerController {
    @Autowired
    private GameService gameService;

    @PostMapping("/{roomCode}/{playerId}/lastWill")
    public ResponseEntity<Void> saveLastWill(@PathVariable String playerId,
                                             @PathVariable String roomCode,
                                             @RequestBody String lastWill) {
        Game game = gameService.getGame(roomCode);
        game.saveLastWill(playerId, lastWill);
        if (game != null) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}