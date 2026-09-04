
const conexion = require('../config/db');

const obtenerCursos = async (req, res) => {
    try {
        const [resultado] = await conexion.query(
            `SELECT id, nombre, creditos
             FROM cursos
             ORDER BY nombre ASC`
        );

        res.json(resultado);

    } catch (error) {
        console.error('Error al obtener cursos:', error);

        res.status(500).json({
            mensaje: 'Error al obtener cursos'
        });
    }
};

module.exports = {
    obtenerCursos
};