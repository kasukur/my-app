import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MovieList from './components/MovieList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="nav-bar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/movies" className="nav-link">Movies</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="home-page">
              <h1>Welcome to Movie Manager</h1>
              <p>Manage your movie collection with ease</p>
              <Link to="/movies" className="cta-button">View Movies</Link>
            </div>
          } />
          <Route path="/movies" element={<MovieList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
