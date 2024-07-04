package com.yourproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import com.yourproject.model.Player;
import com.yourproject.service.GameService;

@Controller
public class WebSocketController {

    @Autowired
    private GameService gameService;

    @MessageMapping("/updatePlayerName/{roomCode}")
    @SendTo("/topic/playerNameUpdate/{roomCode}")
    public Player updatePlayerName(Player player, @org.springframework.messaging.handler.annotation.DestinationVariable String roomCode) {
        // Update the player name in the backend storage
        player.setName(HtmlUtils.htmlEscape(player.getName()));
        gameService.updatePlayerName(roomCode, player);
        return player; // Return the player object with the updated name
    }

    @MessageMapping("/startGame/{roomCode}")
    @SendTo("/topic/startGame/{roomCode}")
    public String startGame(String message) {
        return HtmlUtils.htmlEscape(message);
    }

    @MessageMapping("/advancePhase/{roomCode}")
    @SendTo("/topic/gamePhaseUpdate/{roomCode}")
    public String advancePhase(@org.springframework.messaging.handler.annotation.DestinationVariable String roomCode) {
        gameService.getPhase(roomCode);
        return gameService.getPhase(roomCode);
    }
}
