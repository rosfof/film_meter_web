const oracledb = require('oracledb');
oracledb.thin = true;

const dbConfig = {
  user: 'film_user',
  password: 'film123',
  connectString: 'localhost:1521/XEPDB1'
};

async function diagnostico() {
  let connection;

  try {
    console.log('🔍 Conectando a Oracle XE...');
    connection = await oracledb.getConnection(dbConfig);
    console.log('✅ Conexión exitosa');

    const tabla = await connection.execute(
      `SELECT table_name FROM user_tables WHERE table_name = 'PELICULAS'`
    );

    if (tabla.rows.length === 0) {
      console.log('❌ La tabla PELICULAS no existe');
      return;
    }

    console.log('✅ La tabla PELICULAS existe');

    const count = await connection.execute(`SELECT COUNT(*) FROM peliculas`);
    console.log(`📊 Películas guardadas: ${count.rows[0][0]}`);

    console.log('🧪 Probando inserción de película de prueba...');
    await connection.execute(
      `INSERT INTO peliculas (titulo, tipo, imagen_url)
       VALUES ('Prueba Diagnóstico', 'Película', 'https://ejemplo.com/test.jpg')`,
      {},
      { autoCommit: true }
    );

    console.log('✅ Inserción exitosa');

    const confirm = await connection.execute(
      `SELECT * FROM peliculas WHERE titulo = 'Prueba Diagnóstico'`
    );

    if (confirm.rows.length > 0) {
      console.log('🎉 Película de prueba guardada correctamente');
    } else {
      console.log('⚠️ No se encontró la película de prueba después de insertar');
    }
  } catch (err) {
    console.error('❌ Error detectado:', err.message);
  } finally {
    if (connection) await connection.close();
  }
}

diagnostico();