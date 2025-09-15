import { useState, useEffect } from 'react';

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    const adminPrincipal = {
      id: 'root',
      username: 'admin',
      password: '1234',
      role: 'admin'
    };

    const guardados = JSON.parse(localStorage.getItem('admins')) || [];
    const existePrincipal = guardados.some(a => a.id === 'root');
    const listaFinal = existePrincipal ? guardados : [adminPrincipal, ...guardados];

    localStorage.setItem('admins', JSON.stringify(listaFinal));
    setAdmins(listaFinal);
  }, []);

  const guardarAdmins = (nuevos) => {
    localStorage.setItem('admins', JSON.stringify(nuevos));
    setAdmins(nuevos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevo = { ...form, id: Date.now(), role: 'admin' };
    guardarAdmins([...admins, nuevo]);
    setForm({ username: '', password: '' });
  };

  const handleEdit = (id, campo, valor) => {
    const actualizados = admins.map(a =>
      a.id === id ? { ...a, [campo]: valor } : a
    );
    guardarAdmins(actualizados);
  };

  const handleDelete = (id) => {
    const filtrados = admins.filter(a => a.id !== id);
    guardarAdmins(filtrados);
  };

  return (
    <div className="admin-card">
      <h2>Gestión de Administradores</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Agregar administrador</button>
      </form>

      <div className="admin-list">
        {admins.map(admin => (
          <div key={admin.id} className="admin-item">
            <input
              type="text"
              value={admin.username}
              onChange={(e) =>
                admin.id !== 'root' &&
                handleEdit(admin.id, 'username', e.target.value)
              }
              disabled={admin.id === 'root'}
            />
            <input
              type="password"
              value={admin.password}
              onChange={(e) =>
                admin.id !== 'root' &&
                handleEdit(admin.id, 'password', e.target.value)
              }
              disabled={admin.id === 'root'}
            />
            <div className="admin-item-actions">
              {admin.id !== 'root' && (
                <>
                  <button className="save-btn" onClick={() => guardarAdmins(admins)}>Guardar</button>
                  <button className="delete-btn" onClick={() => handleDelete(admin.id)}>Eliminar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminManager;
