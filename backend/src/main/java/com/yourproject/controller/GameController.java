package com.yourproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yourproject.service.GameService;

@RestController
@RequestMapping("/api/game")
public class GameController {
    @Autowired
    private GameService gameService;

    @PostMapping("/advance")
    public ResponseEntity<Void> advancePhase(@RequestParam String roomCode) {
        gameService.advancePhase(roomCode);
        return ResponseEntity.ok().build();
    }
}