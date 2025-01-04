import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signRequest } from '../utils/aws-signing';
import './MovieList.css';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api'
  : '/prod';

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

  const makeRequest = async (method, path, data = undefined) => {
    try {
      const headers = await signRequest(method, path, data);
      console.log(`Making ${method} request to ${path} with headers:`, headers);
      
      const config = {
        method,
        url: `${API_BASE_URL}${path}`,
        headers,
        data
      };

      const response = await axios(config);
      console.log(`${method} response:`, response.data);
      return response;
    } catch (error) {
      console.error(`${method} request failed:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await makeRequest('GET', '/movies');
      const movieData = response.data.Items || response.data || [];
      
      if (!Array.isArray(movieData)) {
        console.error('Received non-array data:', movieData);
        if (response.data.message) {
          setError(`API Error: ${response.data.message}`);
        } else {
          setError('Invalid data format received');
        }
        setMovies([]);
      } else {
        setMovies(movieData);
        setError(null);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to fetch movies: ${errorMessage}`);
    } finally {
      setLoading(false);
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
      await makeRequest('POST', '/movies', newMovie);
      setNewMovie({ title: '', year: '', director: '' });
      fetchMovies();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to add movie: ${errorMessage}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await makeRequest('DELETE', `/movies/${id}`);
      fetchMovies();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to delete movie: ${errorMessage}`);
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