package com.yourproject.model;

public class Player {
    private String name;
    private String role;
    private boolean isAlive;
    private String lastWill;

    public Player(String name) {
        this.name = name;
        this.isAlive = true;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getters and setters
}