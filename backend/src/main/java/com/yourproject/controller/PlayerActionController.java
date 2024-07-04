package com.yourproject.controller;

import com.yourproject.model.Game;
import com.yourproject.model.Player;
import com.yourproject.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/playerAction")
public class PlayerActionController {
    @Autowired
    private GameService gameService;

    @PostMapping("/{roomCode}/{playerId}/detectiveInvestigatePlayer")
    public ResponseEntity<String> detectiveInvestigatePlayer(@PathVariable String playerId,
                                                             @PathVariable String roomCode,
                                                             @RequestParam String targetId) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            Player initiatorPlayer = game.getPlayer(playerId);
            if (initiatorPlayer.getRole().getTitle().equals("Detective")) { // sanity check
                Player targetPlayer = game.getPlayer(targetId);
                String result = targetPlayer.getRole().getAllegiance().equals("Town") || targetPlayer.getRole().getAllegiance().equals("Neutral") ? targetPlayer.getName() +  "is a friend" : targetPlayer.getName() +  "is a FOE!";
                initiatorPlayer.setDetectiveInvestigationResult(result);
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.ok("You are not a Detective");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{roomCode}/{playerId}/investigationResult")
    public ResponseEntity<String> getInvestigationResult(@PathVariable String roomCode, @PathVariable String playerId) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            Player player = game.getPlayer(playerId);
            return ResponseEntity.ok(player.getDetectiveInvestigationResult());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
