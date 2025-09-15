import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const {
    id,
    title,
    name,
    release_date,
    imagen,
    poster_path,
    tipo,
  } = movie;

  const tituloFinal = title || name || movie.titulo || 'Sin título';
  const año = release_date?.slice(0, 4) || '';
  const imagenFinal = imagen
    ? imagen
    : poster_path
      ? `https://image.tmdb.org/t/p/w300${poster_path}`
      : 'https://via.placeholder.com/300x450?text=Sin+imagen';

  return (
    <Link to={`/pelicula/${id}`} className="movie-card">
      <img src={imagenFinal} alt={tituloFinal} />
      <div className="movie-info">
        <h3>{tituloFinal}</h3>
        <p>{año}</p>
        {tipo && <span className="tipo-label">{tipo === 'serie' ? 'Serie' : 'Película'}</span>}
      </div>
    </Link>
  );
};

export default MovieCard;