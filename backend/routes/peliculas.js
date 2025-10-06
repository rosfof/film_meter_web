const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const multer = require('multer');
const path = require('path');
oracledb.thin = true;

const dbConfig = {
  user: 'film_user',
  password: 'film123',
  connectString: 'localhost:1521/XEPDB1'
};

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: (req, file, cb) => {
    const nombre = Date.now() + path.extname(file.originalname);
    cb(null, nombre);
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM peliculas`);
    res.json(result.rows.map(([id, titulo, tipo, imagen_url]) => ({
      id, titulo, tipo, imagen_url
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

router.post('/', upload.single('archivo'), async (req, res) => {
  const { titulo, tipo, imagen_url } = req.body;

  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const imagenFinal = req.file
    ? `http://localhost:3001/uploads/${req.file.filename}`
    : imagen_url;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO peliculas (titulo, tipo, imagen_url)
       VALUES (:titulo, :tipo, :imagen_url)`,
      { titulo, tipo, imagen_url: imagenFinal },
      { autoCommit: true }
    );
    res.status(201).json({ mensaje: 'Película guardada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `DELETE FROM peliculas WHERE id = :id`,
      { id: parseInt(id) },
      { autoCommit: true }
    );
    res.json({ mensaje: 'Película eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;