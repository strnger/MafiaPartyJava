package com.yourproject.model;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Player {

    private String id;
    private String name;
    private String role;
    private boolean isAlive;
    private String lastWill;

    @JsonCreator
    public Player(@JsonProperty("id") String id,
                  @JsonProperty("name") String name,
                  @JsonProperty("role") String role,
                  @JsonProperty("isAlive") boolean isAlive,
                  @JsonProperty("lastWill") String lastWill) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.isAlive = isAlive;
        this.lastWill = lastWill;
    }

    public Player(String name) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.isAlive = true;
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
}