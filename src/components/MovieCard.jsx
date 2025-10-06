import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MovieCard.css';

const MovieCard = ({ item, tipo }) => {
  const titulo = item.title || item.name || item.titulo || 'Sin título';
  const año = (item.release_date || item.first_air_date || '').slice(0, 4);

  const imagen =
    item.imagen_url?.startsWith('http')
      ? item.imagen_url
      : item.poster_path
        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
        : 'https://via.placeholder.com/200x300?text=Sin+imagen';

  const rating = item.vote_average
    ? item.vote_average.toFixed(1)
    : item.rating || 'N/A';

  return (
    <Link to={`/detalle/${tipo}/${item.id}`} className="movie-card">
      <div className="movie-card-image-container">
        <img
          src={imagen}
          alt={titulo}
          className="movie-card-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x300?text=Sin+imagen';
          }}
        />
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{titulo}</h3>
        <div className="movie-card-meta">
          <span className="movie-card-year">{año}</span>
          <span className="movie-card-rating">⭐ {rating}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;