import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [adminChart, setAdminChart] = useState([]);

  useEffect(() => {
    const adminsData = JSON.parse(localStorage.getItem('admins')) || [];
    const peliculasData = JSON.parse(localStorage.getItem('peliculas')) || [];

    setAdmins(adminsData);
    setPeliculas(peliculasData);

    // Agrupar admins por fecha
    const adminsPorDia = {};
    adminsData.forEach(a => {
      const fecha = new Date(a.id).toLocaleDateString();
      adminsPorDia[fecha] = (adminsPorDia[fecha] || 0) + 1;
    });

    const chartData = Object.entries(adminsPorDia).map(([fecha, cantidad]) => ({
      fecha, cantidad
    }));

    setAdminChart(chartData);
  }, []);

  return (
    <div className="admin-card">
      <h2>Dashboard</h2>

      {/* Métricas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h4>👥 Administradores activos</h4>
          <p>{admins.length}</p>
        </div>
        <div>
          <h4>🎬 Películas registradas</h4>
          <p>{peliculas.length}</p>
        </div>
      </div>

      <h4>📊 Admins agregados por día</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={adminChart}>
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#4e4ef1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
