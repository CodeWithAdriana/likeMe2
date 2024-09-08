const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path'); // Importa el módulo 'path'
const { pool, createTable, insertPost } = require('./config/config');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Crear la tabla
createTable();

// Rutas de la API
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener posts' });
    }
});

app.post('/posts', async (req, res) => {
    const { titulo, url, descripcion } = req.body;
    try {
        await insertPost(titulo, url, descripcion);
        res.status(201).json({ message: 'Post creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el post' });
    }
});

// Servir los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Ajusta 'dist' según tu carpeta de producción

// Manejar todas las rutas no definidas por la API y servir el index.html del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html')); // Ajusta 'dist' si tu carpeta de producción tiene otro nombre
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
