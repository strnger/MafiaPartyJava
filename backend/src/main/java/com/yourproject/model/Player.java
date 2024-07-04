package com.yourproject.model;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Player {

    private String id;
    private String name;
    private Role role;
    private boolean hasLife;
    private String lastWill;
    private Killer killer;

    @JsonCreator
    public Player(@JsonProperty("id") String id,
                  @JsonProperty("name") String name,
                  @JsonProperty("role") Role role,
                  @JsonProperty("hasLife") boolean hasLife,
                  @JsonProperty("lastWill") String lastWill,
                  @JsonProperty("killer") Killer killer) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.hasLife = hasLife;
        this.lastWill = lastWill;
        this.killer = killer;
    }

    public Player(String name) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.hasLife = true;
        this.lastWill = "Type last will here";
        this.killer = null;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setRole(String role) {
        switch (role)
            {
                case "Mafia":
                    this.role = new Mafia();
                    break;
                case "Doctor":
                    this.role = new Doctor();
                    break;
                case "Detective":
                    this.role = new Detective();
                    break;
                default:
                    this.role = new GenericTown();
                    break;
            }
    }

    public boolean isHasLife() {
        return hasLife;
    }

    public void setHasLife(boolean hasLife) {
        this.hasLife = hasLife;
    }

    public String getLastWill() {
        return lastWill;
    }

    public void setLastWill(String lastWill) {
        this.lastWill = lastWill;
    }

    public Killer getKiller() {
        return killer;
    }

    public void setKiller() {
        this.killer = killer;
    }

    public void setKiller(String killer, String roomCode) {
        if(killer.equals("Executed"))
            this.killer = new Killer("Executed", roomCode);
        else
            this.killer = new Killer(killer, roomCode);
    }
}