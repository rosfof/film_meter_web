import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import AdminManager from './AdminManager';
import PeliculasManager from './PeliculasManager';
import Logs from './Logs';
import '../styles/adminpanel.css';

const AdminPanel = () => {
  const [vista, setVista] = useState('dashboard');
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h3>Panel Admin</h3>
        <ul>
          <li onClick={() => setVista('dashboard')}>📊 Dashboard</li>
          <li onClick={() => setVista('admins')}>👥 Administradores</li>
          <li onClick={() => setVista('peliculas')}>🎬 Películas</li>
          <li onClick={() => setVista('logs')}>📄 Actividad</li>
          <li onClick={cerrarSesion}>🔐 Cerrar sesión</li>
        </ul>
      </aside>
      <main className="admin-content">
        {vista === 'dashboard' && <Dashboard />}
        {vista === 'admins' && <AdminManager />}
        {vista === 'peliculas' && <PeliculasManager />}
        {vista === 'logs' && <Logs />}
      </main>
    </div>
  );
};

export default AdminPanel;
