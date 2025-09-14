import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const usuarios = [
  { username: 'admin', password: '1234', role: 'admin' },
  { username: 'diego', password: '5678', role: 'user' }
];

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const usuario = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (usuario) {
      const token = btoa(JSON.stringify(usuario));
      localStorage.setItem('token', token);
      navigate(usuario.role === 'admin' ? '/admin' : '/');
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
