import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieList.css';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: '',
    year: '',
    director: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/prod/movies');
      setMovies(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movies');
      setLoading(false);
      console.error('Error fetching movies:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/prod/movies', newMovie);
      setNewMovie({ title: '', year: '', director: '' });
      fetchMovies();
    } catch (err) {
      setError('Failed to add movie');
      console.error('Error adding movie:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/prod/movies/${id}`);
      fetchMovies();
    } catch (err) {
      setError('Failed to delete movie');
      console.error('Error deleting movie:', err);
    }
  };

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>Loading movies...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <p>{error}</p>
      <button onClick={fetchMovies} className="retry-btn">Retry</button>
    </div>
  );

  return (
    <div className="movie-list">
      <h2>Movies</h2>
      
      <form onSubmit={handleSubmit} className="movie-form">
        <input
          type="text"
          name="title"
          value={newMovie.title}
          onChange={handleInputChange}
          placeholder="Movie Title"
          required
        />
        <input
          type="number"
          name="year"
          value={newMovie.year}
          onChange={handleInputChange}
          placeholder="Release Year"
          required
        />
        <input
          type="text"
          name="director"
          value={newMovie.director}
          onChange={handleInputChange}
          placeholder="Director"
          required
        />
        <button type="submit">Add Movie</button>
      </form>

      <div className="movies-grid">
        {movies.length === 0 ? (
          <div className="no-movies">
            <p>No movies found. Add your first movie!</p>
          </div>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <h3>{movie.title}</h3>
              <p>Year: {movie.year}</p>
              <p>Director: {movie.director}</p>
              <button 
                onClick={() => handleDelete(movie.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieList; 