import React, { useEffect, useState } from 'react';

const CarruselDestacadas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const obtenerPopulares = async () => {
      const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
      const url = 'https://api.themoviedb.org/3/movie/popular?language=es-MX&page=1';

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        });

        const data = await response.json();
        setPeliculas(data.results.slice(0, 5));
      } catch (error) {
        console.error('Error al obtener películas populares:', error);
      }
    };

    obtenerPopulares();
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % peliculas.length);
    }, 30000); // 30 segundos

    return () => clearInterval(intervalo);
  }, [peliculas]);

  if (peliculas.length === 0) return <div>Cargando carrusel...</div>;

  const actual = peliculas[indiceActual];
  const fondo = actual.backdrop_path
    ? `https://image.tmdb.org/t/p/original${actual.backdrop_path}`
    : 'https://via.placeholder.com/1200x400?text=Sin+imagen';

  return (
    <section
      className="carrusel-banner"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '2rem',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <h1>{actual.title}</h1>
        <p>
          {new Date(actual.release_date).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })} · Valoración: {actual.vote_average}
        </p>
      </div>
    </section>
  );
};

export default CarruselDestacadas;