import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import AdminManager from './AdminManager';
import PeliculasManager from './PeliculasManager';

import '../styles/adminpanel.css';

const AdminPanel = () => {
  const [vista, setVista] = useState('dashboard');
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <div
        className="hamburger-btn"
        onClick={() => setMenuVisible(!menuVisible)}
        role="button"
        aria-label="Abrir menú"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2f3542" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </div>

      <aside className={`sidebar ${menuVisible ? 'visible' : ''}`}>
        <h3>Panel</h3>
        <ul>
          <li onClick={() => { setVista('dashboard'); setMenuVisible(false); }}>⌨ Dashboard</li>
          <li onClick={() => { setVista('admins'); setMenuVisible(false); }}>🛠 Administradores</li>
          <li onClick={() => { setVista('peliculas'); setMenuVisible(false); }}>✎ Editar</li>
          <li onClick={() => { cerrarSesion(); setMenuVisible(false); }}>ꄗ Cerrar sesión</li>
        </ul>
      </aside>

      <main className="admin-content">
        {vista === 'dashboard' && <Dashboard />}
        {vista === 'admins' && <AdminManager />}
        {vista === 'peliculas' && <PeliculasManager />}
      </main>
    </div>
  );
};

export default AdminPanel;