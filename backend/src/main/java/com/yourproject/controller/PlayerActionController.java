package com.yourproject.controller;

import com.yourproject.model.Game;
import com.yourproject.model.Player;
import com.yourproject.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playerAction")
public class PlayerActionController {
    @Autowired
    private GameService gameService;

    @PostMapping("/{roomCode}/{playerId}")
    public ResponseEntity<Game> executePlayer(@PathVariable String playerId,
                                              @PathVariable String roomCode,
                                              @RequestParam String targetId) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            game.executePlayer(playerId);
            return ResponseEntity.ok(game);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}