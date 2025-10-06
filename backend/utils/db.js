const oracledb = require('oracledb');
oracledb.thin = true;

const dbConfig = {
  user: 'film_user',
  password: 'film123',
  connectString: 'localhost:1521/XEPDB1'
};

async function guardarPelicula({ titulo, tipo, imagen_url }) {
  let connection;

  try {
    console.log('🔄 Conectando a Oracle XE...');
    connection = await oracledb.getConnection(dbConfig);
    console.log('✅ Conexión establecida');

    const sql = `
      INSERT INTO peliculas (titulo, tipo, imagen_url)
      VALUES (:titulo, :tipo, :imagen_url)
    `;

    await connection.execute(sql, { titulo, tipo, imagen_url }, { autoCommit: true });
    console.log('✅ Película guardada correctamente');
  } catch (err) {
    console.error('❌ Error al guardar película:', err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = { guardarPelicula };