import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Detalle.css';

async function fetchWikipediaSummary(titulo) {
  const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return '';
    const data = await res.json();
    if (data.extract && !data.type?.includes('disambiguation')) {
      return data.extract.length > 500
        ? data.extract.slice(0, 497) + '...'
        : data.extract;
    }
    return '';
  } catch {
    return '';
  }
}

const Detalle = () => {
  const { id, tipo } = useParams();
  const [data, setData] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState('');
  const [temporadas, setTemporadas] = useState([]);
  const [episodiosPorTemporada, setEpisodiosPorTemporada] = useState({});
  const [temporadaAbierta, setTemporadaAbierta] = useState(null);
  const [titleLogo, setTitleLogo] = useState(null);
  const isSerie = tipo === 'serie';

  const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `https://api.themoviedb.org/3/${tipo === 'serie' ? 'tv' : 'movie'}/${id}?language=es-MX&append_to_response=credits,videos`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        });
        const result = await res.json();
        setData(result);

        if (tipo === 'serie' && Array.isArray(result.seasons)) {
          setTemporadas(result.seasons.filter(t => t.season_number !== 0));
        } else {
          setTemporadas([]);
        }

        // Tráiler oficial (YouTube)
        const video = result.videos?.results?.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        );
        setTrailer(video ? `https://www.youtube.com/embed/${video.key}` : null);

        if (result.overview && result.overview.trim() !== '') {
          setOverview(result.overview);
        } else {
          const resumenWiki = await fetchWikipediaSummary(result.title || result.name);
          setOverview(resumenWiki || 'Sin sinopsis disponible.');
        }

        const imagesUrl = `https://api.themoviedb.org/3/${tipo === 'serie' ? 'tv' : 'movie'}/${id}/images?include_image_language=es,en,null`;
        const resImages = await fetch(imagesUrl, {
          headers: { Authorization: `Bearer ${token}`, accept: 'application/json' }
        });
        const imgs = await resImages.json();
        const logos = imgs.logos || [];

        if (logos.length > 0) {
            const pickByLang = (langs) => 
              logos
                .filter(l => langs.includes(l.iso_639_1))
                .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0) || (b.width - a.width));
          
          let elegido =
            pickByLang(['es', 'es-MX', 'es-ES'])[0] ||
            pickByLang(['en'])[0] ||
            logos.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0) || (b.width - a.width))[0];

          if (elegido?.file_path) {
            setTitleLogo(`https://image.tmdb.org/t/p/w500${elegido.file_path}`);
          } 
        } else {
          setTitleLogo(null);
        }

      } catch (error) {
        setData(null);
        setOverview('Sin sinopsis disponible.');
        setTitleLogo(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [id, tipo, token]);

  const handleAbrirTemporada = async (season_number) => {
    if (temporadaAbierta === season_number) {
      setTemporadaAbierta(null);
      return;
    }
    setTemporadaAbierta(season_number);
    if (!episodiosPorTemporada[season_number]) {
      try {
        const url = `https://api.themoviedb.org/3/tv/${id}/season/${season_number}?language=es-MX`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        });
        const result = await res.json();
        setEpisodiosPorTemporada(prev => ({
          ...prev,
          [season_number]: result.episodes || [],
        }));
      } catch {
        setEpisodiosPorTemporada(prev => ({
          ...prev,
          [season_number]: [],
        }));
      }
    }
  };

  if (loading) {
    return <div className="detalle-loading">Cargando detalles...</div>;
  }
  if (!data) {
    return <div className="detalle-error">No se pudo cargar la información.</div>;
  }

  const director = data.credits?.crew?.find(p => p.job === 'Director')?.name || 'Desconocido';
  const cast = data.credits?.cast?.slice(0, 6) || [];
  const generos = data.genres?.map(g => g.name).join(', ') || 'Sin información';
  const fecha = data.release_date || data.first_air_date || '';

    const formatRuntime = (minutos) => {
      if (!minutos || isNaN(minutos)) return '--';
      const h = Math.floor(minutos / 60);
      const m = minutos % 60;
      if (h > 0) return `${h}h ${m ? ' ' + m + 'm' : ''}`;
      return `${m}min`;
    };

    const movieRuntime = !isSerie ? data.runtime : null;

    let serieDuracionTexto = null;
    if (isSerie) {
      const arr = (data.episode_run_time || []).filter(n => !!n);
      if (arr.length === 1) {
        serieDuracionTexto = `${arr[0]} min`;
      } else if (arr.length > 1) {
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        serieDuracionTexto = min === max ? `${min} min` : `${min} - ${max} min`;
      }
    }

  return (
    <div className="detalle-page">
      <div className="detalle-header" style={{
        backgroundImage: data.backdrop_path
          ? `linear-gradient(to right, #181818 60%, transparent), url(https://image.tmdb.org/t/p/original${data.backdrop_path})`
          : undefined
      }}>
        <div className="detalle-poster">
          <img
            src={data.poster_path
              ? `https://image.tmdb.org/t/p/w400${data.poster_path}`
              : 'https://via.placeholder.com/300x450?text=Sin+afiche'}
            alt={data.title || data.name}
          />
        </div>
        <div className="detalle-info">
          {titleLogo ? (
            <img
              src={titleLogo}
              alt={data.title || data.name}
              className="detalle-title-logo"
              loading="lazy"
            />
          ):(
            <h1>{data.title || data.name}</h1>
          )}
          <div className="detalle-meta">
            <span>{fecha ? new Date(fecha).toLocaleDateString('es-CL') : 'Sin fecha'}</span>
            {!isSerie && movieRuntime && <span>{formatRuntime(movieRuntime)}</span>}
            {isSerie && serieDuracionTexto && <span>Promedio: {serieDuracionTexto}</span>}
            <span>•</span>
            <span className="detalle-rating">⭐ {data.vote_average?.toFixed(1)}</span>
          </div>
          <div className="detalle-director">
            <strong>Dirigido por </strong> {director}
          </div>
          <div className="detalle-generos">
            <strong>Géneros:</strong> {generos}
          </div>
          <div className="detalle-sinopsis">
            <strong>Sinopsis</strong>
            <p>{overview || 'Sin sinopsis disponible.'}</p>
          </div>
          <div className="detalle-reparto">
            <strong>Reparto principal</strong>
            <div className="detalle-cast-list">
              {cast.length === 0 && <span>Sin información.</span>}
              {cast.map(actor => (
                <div key={actor.id} className="detalle-cast-item">
                  <img
                    src={actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : 'https://via.placeholder.com/60x90?text=Sin+foto'}
                    alt={actor.name}
                  />
                  <span>{actor.name}</span>
                  <span className="detalle-cast-character">{actor.character}</span>
                </div>
              ))}
            </div>
          </div>
          {trailer && (
            <div className="detalle-trailer">
              <strong>Tráiler oficial</strong>
              <div className="detalle-trailer-video">
                <iframe
                  width="420"
                  height="235"
                  src={trailer}
                  title="Tráiler"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          {/* TEMPORADAS Y EPISODIOS SOLO PARA SERIES */}
          {isSerie && temporadas.length > 0 && (
            <div className="detalle-temporadas">
              <strong>Temporadas</strong>
              <div className="lista-temporadas">
                {temporadas.map(temp => (
                  <div key={temp.id} className="temporada-item">
                    <button
                      className="temporada-btn"
                      onClick={() => handleAbrirTemporada(temp.season_number)}
                    >
                      {temp.name} ({temp.episode_count} episodios)
                    </button>
                    {temporadaAbierta === temp.season_number && (
                      <div className="lista-episodios">
                        {episodiosPorTemporada[temp.season_number]?.length === 0 && (
                          <span>No hay episodios disponibles.</span>
                        )}
                        {episodiosPorTemporada[temp.season_number]?.map(ep => {
                          const epRun = ep.runtime ? formatRuntime(ep.runtime) : null;
                          return (
                            <div key={ep.id} className="episodio-item">
                              <span>
                                <b>{ep.episode_number}.</b> {ep.name}
                                {epRun && <span className="episodio-runtime"> • {epRun}</span>}
                              </span>
                              {ep.air_date && (
                                <span className="episodio-fecha">
                                  ({new Date(ep.air_date).toLocaleDateString('es-CL')})
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <Link className="detalle-volver" to="/">
            ← Volver atrás
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Detalle;