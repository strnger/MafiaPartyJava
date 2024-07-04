package com.yourproject.model;

import com.yourproject.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;

public class Killer {
    private String playerIdOfKiller;
    private String roleOfKiller;

    public Killer(){
            this.playerIdOfKiller = "Executed";
            this.roleOfKiller = "the just rule of the town";
    }


    public Killer(String playerIdOfKiller, String roleOfKiller){
            this.playerIdOfKiller = playerIdOfKiller;
            this.roleOfKiller = roleOfKiller;
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
