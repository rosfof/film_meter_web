import { useState, useEffect } from 'react';
import '../styles/PeliculasManager.css';

const PeliculasManager = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [formManual, setFormManual] = useState({ tipo: 'pelicula', titulo: '', imagen: '' });
  const [contenidoManual, setContenidoManual] = useState([]);
  const [bloqueados, setBloqueados] = useState([]);

  const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) {
        setResultados([]);
        return;
      }

      const bloqueados = JSON.parse(localStorage.getItem('bloqueados') || '[]');

      const buscarContenido = async () => {
        const endpoints = [
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es-MX`,
          `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&language=es-MX`,
        ];

        try {
          const [resPeliculas, resSeries] = await Promise.all(
            endpoints.map(url =>
              fetch(url, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  accept: 'application/json',
                },
              }).then(r => r.json())
            )
          );

          const combinados = [
            ...resPeliculas.results.map(r => ({ ...r, tipo: 'pelicula' })),
            ...resSeries.results.map(r => ({ ...r, tipo: 'serie' })),
          ];

          const filtrados = combinados.filter(item => !bloqueados.includes(item.id));
          setResultados(filtrados);
        } catch (error) {
          console.error('Error al buscar contenido:', error);
        }
      };

      buscarContenido();
    }, 400);

    return () => clearTimeout(delay);
  }, [query, token]);

  useEffect(() => {
    const manual = JSON.parse(localStorage.getItem('contenidoManual') || '[]');
    const bloqueados = JSON.parse(localStorage.getItem('bloqueados') || '[]');
    setContenidoManual(manual);
    setBloqueados(bloqueados);
  }, []);

  const bloquearContenido = (id) => {
    const actualizados = [...bloqueados, id];
    localStorage.setItem('bloqueados', JSON.stringify(actualizados));
    setBloqueados(actualizados);
    setResultados(prev => prev.filter(item => item.id !== id));
  };

  const desbloquearContenido = (id) => {
    const actualizados = bloqueados.filter(b => b !== id);
    localStorage.setItem('bloqueados', JSON.stringify(actualizados));
    setBloqueados(actualizados);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormManual(prev => ({ ...prev, imagen: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const agregarManual = (e) => {
    e.preventDefault();
    const nuevo = { ...formManual, id: Date.now() };
    const actualizados = [...contenidoManual, nuevo];
    localStorage.setItem('contenidoManual', JSON.stringify(actualizados));
    setContenidoManual(actualizados);
    setFormManual({ tipo: 'pelicula', titulo: '', imagen: '' });
  };

  const eliminarManual = (id) => {
    const actualizados = contenidoManual.filter(item => item.id !== id);
    localStorage.setItem('contenidoManual', JSON.stringify(actualizados));
    setContenidoManual(actualizados);
  };

  const peliculasManuales = contenidoManual.filter(item => item.tipo === 'pelicula');
  const seriesManuales = contenidoManual.filter(item => item.tipo === 'serie');

  return (
    <div className="admin-card">
      <h2>Bloquear contenido</h2>

      <div className="admin-form">
        <input
          type="text"
          placeholder="Buscar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="admin-list">
        <h4>Resultados de búsqueda</h4>
        {resultados.map(item => (
          <div key={item.id} className="admin-item">
            <p><strong>{item.title || item.name}</strong> ({item.tipo})</p>
            <button className="delete-btn" onClick={() => bloquearContenido(item.id)}>Bloquear</button>
          </div>
        ))}
      </div>

      <form className="admin-form" onSubmit={agregarManual}>
        <h4>Agregar contenido</h4>
        <select
          value={formManual.tipo}
          onChange={(e) => setFormManual({ ...formManual, tipo: e.target.value })}
        >
          <option value="pelicula">Película</option>
          <option value="serie">Serie</option>
        </select>
        <input
          type="text"
          placeholder="Título"
          value={formManual.titulo}
          onChange={(e) => setFormManual({ ...formManual, titulo: e.target.value })}
          required
        />
        <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
          Imagen sugerida: 300x450px
        </label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button type="submit">Agregar contenido</button>
      </form>

      <div className="admin-list">
        <h4>Películas agregadas</h4>
        {peliculasManuales.map(item => (
          <div key={item.id} className="admin-item">
            {item.imagen && <img src={item.imagen} alt={item.titulo} style={{ width: '80px', borderRadius: '6px' }} />}
            <p><strong>{item.titulo}</strong></p>
            <button className="delete-btn" onClick={() => eliminarManual(item.id)}>Eliminar</button>
          </div>
        ))}

        <h4>Series agregadas</h4>
        {seriesManuales.map(item => (
          <div key={item.id} className="admin-item">
            {item.imagen && <img src={item.imagen} alt={item.titulo} style={{ width: '80px', borderRadius: '6px' }} />}
            <p><strong>{item.titulo}</strong></p>
            <button className="delete-btn" onClick={() => eliminarManual(item.id)}>Eliminar</button>
          </div>
        ))}
      </div>

      <div className="admin-list">
        <h4>Contenido bloqueado</h4>
        {bloqueados.map(id => (
          <div key={id} className="admin-item">
            <p>ID bloqueado: {id}</p>
            <button className="save-btn" onClick={() => desbloquearContenido(id)}>Desbloquear</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeliculasManager;