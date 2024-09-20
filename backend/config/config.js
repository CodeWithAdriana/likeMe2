const { Pool } = require('pg');

// Conexión a la base de datos
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'likeme',
    password: '1234',
    allowExitOnIdle: true,
});

// Crear la tabla
const createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(25) NOT NULL,
                img VARCHAR(1000),
                descripcion VARCHAR(255),
                likes INT DEFAULT 0
            );
        `);
        console.log('Tabla creada o ya existe.');
    } catch (error) {
        console.error('Error al crear la tabla:', error);
    }
};

// Leer todos los posts
const leerPost = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM posts ORDER BY id;");
        return rows;
    } catch (error) {
        console.error('Error al leer los posts:', error);
        throw error;
    }
};

// Inserta datos en la tabla y retorna el post insertado
const insertPost = async (titulo, img, descripcion) => {
    try {
        const consulta = `
            INSERT INTO posts (titulo, img, descripcion)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [titulo, img, descripcion];
        const res = await pool.query(consulta, values);
        console.log('Post insertado:', res.rows[0]);
        return res.rows[0];
    } catch (error) {
        console.error('Error al insertar el post:', error);
        throw error;
    }
};

// Modificar los likes de un post
const modificarPost = async (id) => {
    try {
        const consulta = `
            UPDATE posts 
            SET likes = COALESCE(likes, 0) + 1 
            WHERE id = $1;
        `;
        const values = [id];
        await pool.query(consulta, values);
        console.log('Post modificado.');
    } catch (error) {
        console.error('Error al modificar el post:', error);
        throw error;
    }
};

// Eliminar un post por ID
const eliminarPost = async (id) => {
    try {
        const consulta = "DELETE FROM posts WHERE id = $1;";
        const values = [id];
        await pool.query(consulta, values);
        console.log('Post eliminado.');
    } catch (error) {
        console.error('Error al eliminar el post:', error);
        throw error;
    }
};

module.exports = {
    pool,
    createTable,
    leerPost,
    insertPost,
    modificarPost,
    eliminarPost
};
