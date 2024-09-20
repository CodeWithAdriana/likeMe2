const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path'); // Importa el módulo 'path'
const { pool, createTable, insertPost } = require('./config/config');

const app = express();

app.use(morgan('dev'));
app.use(cors()); // Permitir solicitudes de cualquier origen. Puedes especificar el frontend si lo deseas.
app.use(express.json());

// Crear la tabla en la base de datos al iniciar la aplicación
createTable();

// Ruta para obtener todos los posts
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener posts' });
    }
});

// Ruta para agregar un nuevo post
app.post('/posts', async (req, res) => {
    const { titulo, url, descripcion } = req.body;
    try {
        await insertPost(titulo, url, descripcion);
        res.status(201).json({ message: 'Post creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el post' });
    }
});

// Ruta para aumentar los likes de un post por ID
app.put('/posts/like/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1', [id]);
        res.status(200).json({ message: 'Like agregado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar like' });
    }
});

// Ruta para eliminar un post por ID
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        res.status(200).json({ message: 'Post eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el post' });
    }
});

// Servir los archivos estáticos del frontend (ajusta según tu carpeta de producción)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Manejar todas las rutas no definidas por la API y servir el index.html del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
