import '../styles/NoAutorizado.css';

const NoAutorizado = () => (
  <div className="no-autorizado-container">
    <div className="no-autorizado-mensaje">
      <div className="icono-x">✖</div>
      <h2>Acceso denegado</h2>
      <p>No tienes permisos para ver esta sección.</p>
    </div>
  </div>
);

export default NoAutorizado;