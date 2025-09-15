import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const adminPrincipal = {
    id: 'root',
    username: 'admin',
    password: '1234',
    role: 'admin'
  };

  // Cargar admins desde localStorage y asegurar que todos tengan rol
  const adminsGuardados = JSON.parse(localStorage.getItem('admins')) || [];
  const usuarios = [adminPrincipal, ...adminsGuardados].map(u => ({
    ...u,
    role: u.role || 'admin' // Asegura que todos tengan rol
  }));

  const handleLogin = (e) => {
    e.preventDefault();

    const usuario = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (usuario) {
      const token = btoa(JSON.stringify(usuario));
      localStorage.setItem('token', token);

      // Validar rol explícitamente
      if (usuario.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
