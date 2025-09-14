import React, { useEffect, useState } from 'react';
import '../styles/Inicio.css';

const Inicio = () => {
  const [peliculasPopulares, setPeliculasPopulares] = useState([]);
  const [seriesPopulares, setSeriesPopulares] = useState([]);
  const [peliculasValoradas, setPeliculasValoradas] = useState([]);
  const [seriesValoradas, setSeriesValoradas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [detalles, setDetalles] = useState(null);

  const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      const endpoints = {
        peliculasPopulares: 'https://api.themoviedb.org/3/movie/popular?language=es-MX&page=1',
        seriesPopulares: 'https://api.themoviedb.org/3/tv/popular?language=es-MX&page=1',
        peliculasValoradas: 'https://api.themoviedb.org/3/movie/top_rated?language=es-MX&page=1',
        seriesValoradas: 'https://api.themoviedb.org/3/tv/top_rated?language=es-MX&page=1',
      };

      try {
        const [resPeliculas, resSeries, resValoradas, resSeriesValoradas] = await Promise.all([
          fetch(endpoints.peliculasPopulares, { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } }),
          fetch(endpoints.seriesPopulares, { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } }),
          fetch(endpoints.peliculasValoradas, { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } }),
          fetch(endpoints.seriesValoradas, { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } }),
        ]);

        const dataPeliculas = await resPeliculas.json();
        const dataSeries = await resSeries.json();
        const dataValoradas = await resValoradas.json();
        const dataSeriesValoradas = await resSeriesValoradas.json();

        setPeliculasPopulares(dataPeliculas.results.slice(0, 8));
        setSeriesPopulares(dataSeries.results.slice(0, 8));
        setPeliculasValoradas(dataValoradas.results.slice(0, 8));
        setSeriesValoradas(dataSeriesValoradas.results.slice(0, 8));
      } catch (error) {
        console.error('Error al obtener contenido:', error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % peliculasPopulares.length);
    }, 30000);

    return () => clearInterval(intervalo);
  }, [peliculasPopulares]);

  useEffect(() => {
    const obtenerDetalles = async () => {
      if (peliculasPopulares.length === 0) return;

      const id = peliculasPopulares[indiceActual].id;
      const url = `https://api.themoviedb.org/3/movie/${id}?language=es-MX&append_to_response=credits`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        });

        const data = await response.json();
        const director = data.credits.crew.find((persona) => persona.job === 'Director');
        setDetalles({
          director: director ? director.name : 'Desconocido',
          duracion: data.runtime,
        });
      } catch (error) {
        console.error('Error al obtener detalles de la película:', error);
      }
    };

    obtenerDetalles();
  }, [indiceActual, peliculasPopulares, token]);

  if (peliculasPopulares.length === 0 || !detalles) {
    return <div className="inicio-page">Cargando contenido...</div>;
  }

  const actual = peliculasPopulares[indiceActual];
  const fondo = actual?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${actual.backdrop_path}`
    : 'https://via.placeholder.com/1200x600?text=Sin+imagen';

  const renderTarjetas = (lista) =>
    lista.map((item) => (
      <div key={item.id} className="inicio-card">
        <img
          src={
            item.poster_path
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : 'https://via.placeholder.com/200x300?text=Sin+imagen'
          }
          alt={item.title || item.name}
        />
        <p>{item.title || item.name}</p>
      </div>
    ));

  return (
    <div className="inicio-page">
      <div className="banner-wrapper">
        <section
          className="banner"
          style={{
            backgroundImage: `url(${fondo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="banner-overlay">
            <button onClick={() => setIndiceActual((prev) => (prev === 0 ? peliculasPopulares.length - 1 : prev - 1))} className="control-btn left">⟨</button>

            <div className="banner-content">
              <h1>{actual.title}</h1>
              <p className="director">Director: {detalles.director}</p>
              <p className="fecha">
                {new Date(actual.release_date).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} · Duración: {detalles.duracion} min
              </p>
              <p className="valoracion">
                ⭐ {actual.vote_average} · Valoración TMDB
              </p>
              <p className="sinopsis">{actual.overview}</p>
            </div>

            <button onClick={() => setIndiceActual((prev) => (prev + 1) % peliculasPopulares.length)} className="control-btn right">⟩</button>
          </div>
        </section>
      </div>

      <main className="inicio-secciones">
        <section>
          <h2>Películas Populares</h2>
          <div className="inicio-grid">{renderTarjetas(peliculasPopulares)}</div>
        </section>

        <section>
          <h2>Series Populares</h2>
          <div className="inicio-grid">{renderTarjetas(seriesPopulares)}</div>
        </section>

        <section>
          <h2>Películas Mejor Valoradas</h2>
          <div className="inicio-grid">{renderTarjetas(peliculasValoradas)}</div>
        </section>

        <section>
          <h2>Series Mejor Valoradas</h2>
          <div className="inicio-grid">{renderTarjetas(seriesValoradas)}</div>
        </section>
      </main>
    </div>
  );
};

export default Inicio;