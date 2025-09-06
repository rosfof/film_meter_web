import React, { useState } from 'react';

const Buscador = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);

  const buscarPeliculas = async (e) => {
    e.preventDefault();
    if (!query) return;

    const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=es-ES&page=1`;

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
    <div style={{ padding: '2rem' }}>
      <form onSubmit={buscarPeliculas}>
        <input
          type="text"
          placeholder="Buscar película..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>Buscar</button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        {resultados.length > 0 ? (
          <ul>
            {resultados.map((pelicula) => (
              <li key={pelicula.id}>
                <strong>{pelicula.title}</strong> ({pelicula.release_date?.slice(0, 4)})
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay resultados.</p>
        )}
      </div>
    </div>
  );
};

export default Buscador;