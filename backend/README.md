I am working on a Mafia party game project, please ask for any questions such as folder structure or to see other files as necessary. I will ask my question in the next message:


Project Overview:

    Lobby Page:
        Run only by the host for all to see (host does not participate). 
        Displays a room code, list of players who have joined, available roles with adjustable counters (by the host), and a start game button.
    Join Page:
        Allows players to enter their name and join a game.
        Players can change their name until the game starts.
    Game Phases (Once Started):
        Central display shows the list of players, their status (alive/dead). If dead, their last saved will and role.
        Displays current phase (day, trial, night) with a button to advance phases.
        Trial phase includes vote counts and execution logic.
    Player Page:
        Button to reveal role for 5 seconds.
        Textbox for last will and save button
        If trial phase, list of all townspeople for voting
        If night phase, certain interfaces will be given
            For example, at night the mafia will have a list of non-mafia members to vote to kill, as well as a mafia chat
            If a townsperson, such as an investigator, a full list of everyone alive to investigate for that night
        

Technical Requirements:

    Backend:
        Implemented in Java using Spring Boot.
        Manages game state, handles WebSocket for real-time updates, and CORS configuration.
        Logic to determine the winner should be placed in the backend.
    Frontend:
        Built using React, designed to be mobile-friendly.
        Dynamic updates based on game state changes, ideally using WebSocket.
        Components for different pages: Lobby, Join, Game, Player.

Other considerations:

    No User Authentication Required: The goal is simplicity for joining games using room codes.
    Role Management: Host sets the number of each role before the game starts; roles are assigned randomly.
    Real-time Updates: Emphasized importance of dynamic updates without page refresh.
    Backend Persistence: Decided to use in-memory storage for simplicity.
    Frontend Navigation: Use react-router-dom for routing and navigation.
    Global CORS Configuration: Added a CORS configuration to handle requests from the frontend.
    Host Role: Host manages the lobby but does not participate in the game.