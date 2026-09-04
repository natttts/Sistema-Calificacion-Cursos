const express = require('express');
const cors = require('cors');
const conexion = require('./config/db');

const usuarioRutas = require('./rutas/usuarioRutas');
const cursoRutas = require('./rutas/cursoRutas');
const catedraticoRutas = require('./rutas/catedraticoRutas');
const publicacionRutas = require('./rutas/publicacionRutas');
const comentarioRutas = require('./rutas/comentarioRutas');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRutas);
app.use('/api/cursos', cursoRutas);
app.use('/api/catedraticos', catedraticoRutas);
app.use('/api/publicaciones', publicacionRutas);
app.use('/api/comentarios', comentarioRutas);


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