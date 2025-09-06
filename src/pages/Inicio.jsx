import React, { useEffect, useState } from 'react';
import '../styles/Inicio.css';

const Inicio = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const obtenerPopulares = async () => {
      const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
      const url = 'https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1';

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        });

        const data = await response.json();
        setPeliculas(data.results.slice(0, 5)); // Solo las 5 primeras
      } catch (error) {
        console.error('Error al obtener películas populares:', error);
      }
    };

    obtenerPopulares();
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % peliculas.length);
    }, 30000); // Cambia cada 30 segundos

    return () => clearInterval(intervalo);
  }, [peliculas]);

  if (peliculas.length === 0) {
    return <div className="inicio-page">Cargando películas destacadas...</div>;
  }

  const actual = peliculas[indiceActual];
  const fondo = actual.backdrop_path
    ? `https://image.tmdb.org/t/p/original${actual.backdrop_path}`
    : 'https://via.placeholder.com/1200x400?text=Sin+imagen';

  return (
    <div className="inicio-page">
      {/* 🎬 Banner dinámico */}
      <section
        className="banner"
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
        <div className="banner-content">
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

      {/* 🧩 Secciones adicionales opcionales */}
      <main className="secciones">
        <section>
          <h2>Más Populares</h2>
          <div className="grid-peliculas">
            {peliculas.map((peli) => (
              <div key={peli.id} className="mini-card">
                <img
                  src={
                    peli.poster_path
                      ? `https://image.tmdb.org/t/p/w200${peli.poster_path}`
                      : 'https://via.placeholder.com/200x300?text=Sin+imagen'
                  }
                  alt={peli.title}
                />
                <p>{peli.title}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Inicio;