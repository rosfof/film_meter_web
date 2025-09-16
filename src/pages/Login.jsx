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

  const adminsGuardados = JSON.parse(localStorage.getItem('admins')) || [];
  const usuarios = [adminPrincipal, ...adminsGuardados].map(u => ({
    ...u,
    role: u.role || 'admin'
  }));

  const handleLogin = (e) => {
    e.preventDefault();

    const usuario = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (!usuario) {
      alert('Usuario o contraseña incorrectos');
      return;
    }

    try {
      const token = btoa(JSON.stringify(usuario));
      localStorage.setItem('token', token);

      if (usuario.role && usuario.role === 'admin') {
        const confirmToken = localStorage.getItem('token');
        if (confirmToken) {
          navigate('/admin');
        } else {
          alert('Error al guardar sesión. Intenta nuevamente.');
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error inesperado. Intenta nuevamente.');
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