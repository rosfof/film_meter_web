import React, { useState } from 'react';
import '../styles/Buscador.css';

const Buscador = () => {
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

  return (
    <div className="buscador-page">
      <form onSubmit={buscarPeliculas} className="buscador-form">
        <input
          type="text"
          placeholder="Buscar película..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="buscador-input"
        />
        <button type="submit" className="buscador-btn">Buscar</button>
      </form>

      <div className="buscador-grid">
        {resultados.length > 0 ? (
          resultados.map((pelicula) => (
            <div key={pelicula.id} className="buscador-card">
              <img
                src={pelicula.poster_path
                  ? `https://image.tmdb.org/t/p/w200${pelicula.poster_path}`
                  : 'https://via.placeholder.com/200x300?text=Sin+imagen'}
                alt={pelicula.title}
              />
              <p>{pelicula.title} ({pelicula.release_date?.slice(0, 4)})</p>
            </div>
          ))
        ) : (
          <p className="buscador-vacio">No hay resultados.</p>
        )}
      </div>
    </div>
  );
};

export default Buscador;