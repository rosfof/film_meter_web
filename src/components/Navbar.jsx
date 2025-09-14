import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';
import MovieCard from './MovieCard';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);

  const buscarPeliculas = async (e) => {
    e.preventDefault();
    if (!query) return;

    const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=es-MX&page=1`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      });

      const data = await response.json();
      setResultados(data.results || []);
    } catch (error) {
      console.error('Error al buscar películas:', error);
    }
  };

  useEffect(() => {
    if (query.trim() === '') {
      setResultados([]);
    }
  }, [query]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="FilmMeter Logo" className="logo" />
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <ul className={`navbar-center ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/peliculas">Películas</Link></li>
        <li><Link to="/series">Series</Link></li>
        <li><Link to="/estrenos">Estrenos</Link></li>
      </ul>

      <div className="navbar-right">
        <form onSubmit={buscarPeliculas} className="navbar-form">
          <input
            type="text"
            placeholder="Buscar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="navbar-input"
          />
        </form>
      </div>

      {resultados.length > 0 && (
        <div className="search-results">
          <div className="search-grid">
            {resultados.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
