
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const conexion = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Servidor funcionando '
    });
});

app.get('/api/prueba-db', async (req, res) => {
    try {
        const [resultado] = await conexion.query('SELECT 1 AS conectado');

        res.json({
            mensaje: 'Conexión con MySQL funcionando ',
            resultado: resultado
        });

    } catch (error) {
        console.error('Error al conectar con MySQL:', error);

        res.status(500).json({
            mensaje: 'Error al conectar con MySQL'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});