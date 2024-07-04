package com.yourproject.model;

import com.yourproject.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;

public class Killer {
    @Autowired
    private GameService gameService;
    private String playerIdOfKiller;
    private String roleOfKiller;

    public Killer(String playerIdOfKiller, String roomCode){
        if(playerIdOfKiller.equals("Executed")){
            this.playerIdOfKiller = "Executed";
            this.roleOfKiller = "the just rule of the town";
        }else{
            this.playerIdOfKiller = playerIdOfKiller;
            Game game = gameService.getGame(roomCode);
            this.roleOfKiller = game.getPlayers()
                    .stream()
                    .filter(p -> p.getId().equals(playerIdOfKiller))
                    .findFirst()
                    .map(p -> p.getRole().getTitle())
                    .orElse(null);
        }
    }

    public String getPlayerIdOfKiller() {
        return playerIdOfKiller;
    }

    public void setPlayerIdOfKiller(String playerIdOfKiller) {
        this.playerIdOfKiller = playerIdOfKiller;
    }

    public String getRoleOfKiller() {
        return roleOfKiller;
    }

    public void setRoleOfKiller(String roleOfKiller) {
        this.roleOfKiller = roleOfKiller;
    }
}
