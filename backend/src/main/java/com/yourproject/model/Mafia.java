package com.yourproject.model;

    public class Mafia extends Role{
        public Mafia(){
            super("Mafia", "Kill everyone who doesn't submit to the mafia", "Each night you get a vote on who your team kills. \nIf there is a tie, the choice is made randomly from the votes. \nThe killer is chosen from one of the mafia that voted for that player.");
        }
}
