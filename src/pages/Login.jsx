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
    role: u.role || 'admin'
  }));

  const handleLogin = (e) => {
    e.preventDefault();

    // Buscar usuario válido
    const usuario = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (!usuario) {
      alert('Usuario o contraseña incorrectos');
      return;
    }

    try {
      // Guardar token de forma segura
      const token = btoa(JSON.stringify(usuario));
      localStorage.setItem('token', token);

      // Validar rol y redirigir
      if (usuario.role && usuario.role === 'admin') {
        // Confirmar que el token se guardó antes de redirigir
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