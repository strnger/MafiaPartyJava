package com.yourproject.model;

import java.util.UUID;

public class Player {

    private String id;
    private String name;
    private String role;
    private boolean isAlive;
    private String lastWill;

    public Player(String id, String name) {
        this.id = id;
        this.name = name;
    }
    public Player(String name) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
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