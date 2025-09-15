import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

const Dashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [logs, setLogs] = useState([]);
  const [actividadPorDia, setActividadPorDia] = useState([]);

  useEffect(() => {
    const storedAdmins = JSON.parse(localStorage.getItem('admins')) || [];
    const storedPeliculas = JSON.parse(localStorage.getItem('peliculas')) || [];
    const storedLogs = JSON.parse(localStorage.getItem('logs')) || [];

    setAdmins(storedAdmins);
    setPeliculas(storedPeliculas);
    setLogs(storedLogs);

    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const actividad = dias.map((dia, index) => {
      const acciones = storedLogs.filter(log => {
        const fecha = new Date(log.timestamp);
        return fecha.getDay() === ((index + 1) % 7);
      }).length;
      return { dia, acciones };
    });

    setActividadPorDia(actividad);
  }, []);

  return (
    <div className="admin-card">
      <h4>Resumen</h4>
      <div className="dashboard-metric-group">
        <div className="dashboard-metric admin">
          <h5>👥 Administradores</h5>
          <p>{admins.length}</p>
        </div>
        <div className="dashboard-metric peliculas">
          <h5>🎬 Películas</h5>
          <p>{peliculas.length}</p>
        </div>
        <div className="dashboard-metric logs">
          <h5>📄 Acciones</h5>
          <p>{logs.length}</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4>Actividad semanal</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={actividadPorDia}>
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="acciones" fill="#4e4ef1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4>Últimas acciones</h4>
        <ul>
          {logs.slice(-5).reverse().map((log, index) => (
            <li key={index}>
              {log.descripcion || 'Acción registrada'} — {dayjs(log.timestamp).format('DD/MM/YYYY HH:mm')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;