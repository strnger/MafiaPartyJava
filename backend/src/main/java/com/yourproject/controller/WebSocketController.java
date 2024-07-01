package com.yourproject.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class WebSocketController {

    @MessageMapping("/updatePlayerName/{roomCode}")
    @SendTo("/topic/playerNameUpdate/{roomCode}")
    public String updatePlayerName(String playerName) {
        // Handle name update logic
        return HtmlUtils.htmlEscape(playerName);
    }

    @MessageMapping("/startGame/{roomCode}")
    @SendTo("/topic/startGame/{roomCode}")
    public String startGame(String message) {
        // Handle start game logic
        return HtmlUtils.htmlEscape(message);
    }
}
