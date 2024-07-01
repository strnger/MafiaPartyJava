import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LobbyPage from './components/LobbyPage';
import JoinPage from './components/JoinPage';
import GamePage from './components/GamePage';
import PlayerPage from './components/PlayerPage';
import CreateLobbyPage from './components/CreateLobbyPage';
import PlayerWaiting from './components/PlayerWaiting';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CreateLobbyPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/lobby/:roomCode" element={<LobbyPage />} />
          <Route path="/game/:roomCode" element={<GamePage />} />
          <Route path="/player" element={<PlayerPage />} />
          <Route path="/PlayerWaiting" element={<PlayerWaiting />} />
          <Route path="/PlayerPage" element={<PlayerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
