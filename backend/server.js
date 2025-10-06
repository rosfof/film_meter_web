const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const peliculasRouter = require('./routes/peliculas');
app.use('/api/peliculas', peliculasRouter);

app.listen(3001, () => {
  console.log('🚀 Servidor backend corriendo en http://localhost:3001');
});