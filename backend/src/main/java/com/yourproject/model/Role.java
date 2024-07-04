package com.yourproject.model;

public class Role {



    private String title;
    private String objective;
    private String description;
    private String allegiance;


    public Role(String roleTitle, String objective, String description, String allegiance) {
        this.title = roleTitle;
        this.objective = objective;
        this.description = description;
        this.allegiance = allegiance;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAllegiance() {
        return allegiance;
    }

    public void setAllegiance(String allegiance) {
        this.allegiance = allegiance;
    }
}
