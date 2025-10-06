const { guardarPelicula } = require('./db');

guardarPelicula({
  titulo: 'Matrix',
  tipo: 'Película',
  imagen_url: 'https://ejemplo.com/matrix.jpg'
});