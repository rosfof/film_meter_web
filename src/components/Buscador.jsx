import React, { useState } from 'react';
import '../styles/Buscador.css';

const Buscador = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [fuente, setFuente] = useState('local');

  const buscarPeliculas = async (e) => {
    e.preventDefault();

    try {
      const resLocal = await fetch('http://localhost:3001/api/peliculas');
      const dataLocal = await resLocal.json();

      let filtradas = dataLocal;

      if (query.trim() !== '') {
        filtradas = dataLocal.filter(p =>
          typeof p.titulo === 'string' &&
          p.titulo.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (filtradas.length > 0) {
        setResultados(filtradas);
        setFuente('local');
        return;
      }

      const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=es-MX&page=1`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      });

      const data = await response.json();
      setResultados(data.results || []);
      setFuente('tmdb');
    } catch (error) {
      console.error('❌ Error al buscar películas:', error.message);
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
          resultados.map((p) => {
            const imagenTMDB = p.poster_path || p.backdrop_path;

            const urlImagen =
              fuente === 'local'
                ? p.imagen_url || 'https://via.placeholder.com/200x300?text=Sin+imagen'
                : imagenTMDB
                  ? `https://image.tmdb.org/t/p/w300${imagenTMDB}`
                  : 'https://via.placeholder.com/200x300?text=Sin+imagen';

            return (
              <div key={p.id || p.title} className="buscador-card">
                <img
                  src={urlImagen}
                  alt={p.titulo || p.title}
                  style={{ width: '150px', borderRadius: '6px' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x300?text=Sin+imagen';
                  }}
                />
                <p>
                  {fuente === 'local'
                    ? `${p.titulo} (${p.tipo})`
                    : `${p.title} (${p.release_date?.slice(0, 4) || 'Sin año'})`}
                </p>
              </div>
            );
          })
        ) : (
          <p className="buscador-vacio">No hay resultados.</p>
        )}
      </div>
    </div>
  );
};

export default Buscador;