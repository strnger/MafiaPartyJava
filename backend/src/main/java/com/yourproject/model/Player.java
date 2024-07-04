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

    @JsonCreator
    public Player(@JsonProperty("id") String id,
                  @JsonProperty("name") String name,
                  @JsonProperty("role") Role role,
                  @JsonProperty("hasLife") boolean hasLife,
                  @JsonProperty("lastWill") String lastWill) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.hasLife = hasLife;
        this.lastWill = lastWill;
    }

    public Player(String name) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.hasLife = true;
        this.lastWill = "Type last will here";
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

}