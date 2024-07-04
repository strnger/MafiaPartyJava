package com.yourproject.controller;

import com.yourproject.model.Game;
import com.yourproject.temporaryClasses.MafiaChatMessage;
import com.yourproject.temporaryClasses.MafiaVoteMessage;
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
        player.setName(HtmlUtils.htmlEscape(player.getName()));
        gameService.updatePlayerName(roomCode, player);
        return player;
    }

    @MessageMapping("/startGame/{roomCode}")
    @SendTo("/topic/startGame/{roomCode}")
    public String startGame(String message) {
        return HtmlUtils.htmlEscape(message);
    }

    @MessageMapping("/advancePhase/{roomCode}")
    @SendTo("/topic/gamePhaseUpdate/{roomCode}")
    public String advancePhase(@org.springframework.messaging.handler.annotation.DestinationVariable  String roomCode) {
        return gameService.advancePhase(roomCode);
    }

    @MessageMapping("/mafiaVote/{roomCode}")
    @SendTo("/topic/mafiaVoteUpdate/{roomCode}")
    public String mafiaVote(MafiaVoteMessage message, @org.springframework.messaging.handler.annotation.DestinationVariable String roomCode) {
        Game game = gameService.getGame(roomCode);
        if (game != null) {
            game.addMafiaVote(message.getPlayerId(), message.getTargetId());
            return HtmlUtils.htmlEscape(message.getPlayerName() + " has voted to kill " + message.getTargetName());
        }
        return HtmlUtils.htmlEscape("Error processing vote");
    }

    @MessageMapping("/mafiaChat/{roomCode}")
    @SendTo("/topic/mafiaChat/{roomCode}")
    public String mafiaChat(MafiaChatMessage message, @org.springframework.messaging.handler.annotation.DestinationVariable String roomCode) {
        return HtmlUtils.htmlEscape(message.getPlayerName() + ": " + message.getMessage());
    }
}
