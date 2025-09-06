import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=Sin+imagen';

  return (
    <Link to={`/pelicula/${movie.id}`} className="movie-card">
      <img src={posterUrl} alt={movie.title} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.slice(0, 4)}</p>
      </div>
    </Link>
  );
};

export default MovieCard;