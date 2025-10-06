import { useState, useEffect } from 'react';
import '../styles/PeliculasManager.css';

const PeliculasManager = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [bloqueadas, setBloqueadas] = useState([]);
  const [form, setForm] = useState({
    tipo: 'Película',
    titulo: '',
    imagen_url: '',
    archivo: null
  });
  const [guardados, setGuardados] = useState([]);

  const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  const cargarGuardados = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/peliculas');
      const data = await res.json();
      setGuardados(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarGuardados();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) {
        setResultados([]);
        return;
      }

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
            ...resPeliculas.results.map(r => ({ ...r, tipo: 'Película' })),
            ...resSeries.results.map(r => ({ ...r, tipo: 'Serie' })),
          ];

          const bloqueados = JSON.parse(localStorage.getItem('bloqueados') || '[]');
          const filtrados = combinados.filter(item => !bloqueados.includes(item.id));

          setResultados(filtrados);
        } catch (error) {
          console.error(error);
        }
      };

      buscarContenido();
    }, 400);

    return () => clearTimeout(delay);
  }, [query, token]);

  useEffect(() => {
    const cargarBloqueadas = async () => {
      const ids = JSON.parse(localStorage.getItem('bloqueados') || '[]');
      if (ids.length === 0) {
        setBloqueadas([]);
        return;
      }

      try {
        const peticiones = ids.map(id =>
          fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-MX`, {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: 'application/json',
            },
          }).then(r => r.json())
        );

        const resultados = await Promise.all(peticiones);
        setBloqueadas(resultados.filter(r => r && r.id));
      } catch (err) {
        console.error('Error al cargar bloqueadas:', err);
      }
    };

    cargarBloqueadas();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('titulo', form.titulo);
    formData.append('tipo', form.tipo);
    formData.append('imagen_url', form.imagen_url);
    if (form.archivo) {
      formData.append('archivo', form.archivo);
    }

    try {
      const res = await fetch('http://localhost:3001/api/peliculas', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      alert(data.mensaje || 'Película guardada');
      setForm({ tipo: 'Película', titulo: '', imagen_url: '', archivo: null });
      cargarGuardados();
    } catch (err) {
      console.error(err);
      alert('Error al guardar película');
    }
  };

  const eliminarPelicula = async (id) => {
    if (!window.confirm('¿Eliminar esta película?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/peliculas/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      alert(data.mensaje || 'Película eliminada');
      cargarGuardados();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar película');
    }
  };

  return (
    <div className="admin-card">
      <h2>✎ Editar contenido</h2>

      <div className="admin-form">
        <input
          type="text"
          placeholder="Buscar en TMDB"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="admin-list">
        <h4>Resultados de búsqueda</h4>
        {resultados.map(item => (
          <div key={item.id} className="admin-item">
            <p><strong>{item.title || item.name}</strong> ({item.tipo})</p>
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                  : 'https://via.placeholder.com/100x150?text=Sin+imagen'
              }
              alt={item.title || item.name}
              style={{ width: '100px', borderRadius: '6px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <button
              style={{
                marginTop: '6px',
                backgroundColor: '#ff4d4d',
                color: '#fff',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => {
                const bloqueados = JSON.parse(localStorage.getItem('bloqueados') || '[]');
                if (!bloqueados.includes(item.id)) {
                  localStorage.setItem('bloqueados', JSON.stringify([...bloqueados, item.id]));
                  setResultados(prev => prev.filter(r => r.id !== item.id));
                }
              }}
            >
              Bloquear
            </button>
          </div>
        ))}
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h4>Agregar contenido</h4>
        <select
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        >
          <option value="Película">Película</option>
          <option value="Serie">Serie</option>
        </select>
        <input
          type="text"
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="URL de imagen (Opcional)"
          value={form.imagen_url}
          onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, archivo: e.target.files[0] })}
          />
          <small style={{ color: '#888', fontSize: '0.85rem' }}>
            📐 Carga imágenes de 300×450px para mejor visualización.
          </small>
        </div>
        {(form.imagen_url || form.archivo) && (
          <div style={{ marginTop: '10px' }}>
            <img
              src={
                form.archivo
                  ? URL.createObjectURL(form.archivo)
                  : form.imagen_url
              }
              alt="Vista previa"
              style={{ width: '100px', borderRadius: '6px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
        <button type="submit">Guardar</button>
      </form>

      <div className="admin-list">
        <h4>Contenido agregado</h4>
        {guardados.map(item => (
          <div key={item.id} className="admin-item">
            {item.imagen_url && (
              <img
                src={item.imagen_url}
                alt={item.titulo}
                style={{ width: '100px', borderRadius: '6px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <p><strong>{item.titulo}</strong> ({item.tipo})</p>
            <button className="delete-btn" onClick={() => eliminarPelicula(item.id)}>Eliminar</button>
          </div>
        ))}
      </div>

        <div className="admin-list">
        <h4>Contenido bloqueado</h4>
        {bloqueadas.length === 0 ? (
          <p style={{ color: '#888' }}>No hay contenido bloqueado.</p>
        ) : (
          bloqueadas.map(item => (
            <div key={item.id} className="admin-item">
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                    : 'https://via.placeholder.com/100x150?text=Sin+imagen'
                }
                alt={item.title}
                style={{ width: '100px', borderRadius: '6px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <p><strong>{item.title}</strong></p>
              <button
                className="delete-btn"
                onClick={() => {
                  const actual = JSON.parse(localStorage.getItem('bloqueados') || '[]');
                  const nueva = actual.filter(id => id !== item.id);
                  localStorage.setItem('bloqueados', JSON.stringify(nueva));
                  setBloqueadas(prev => prev.filter(p => p.id !== item.id));
                }}
              >
                Desbloquear
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PeliculasManager;