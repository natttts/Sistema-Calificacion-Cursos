
const conexion = require('../config/db');

const obtenerCatedraticos = async (req, res) => {
    try {
        const [resultado] = await conexion.query(
            `SELECT id, nombre
             FROM catedraticos
             ORDER BY nombre ASC`
        );

        res.json(resultado);

    } catch (error) {
        console.error('Error al obtener catedráticos:', error);

        res.status(500).json({
            mensaje: 'Error al obtener catedráticos'
        });
    }
};

const obtenerCursosPorCatedratico = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexion.query(
            `SELECT cursos.id, cursos.nombre, cursos.creditos
             FROM curso_catedratico
             INNER JOIN cursos
             ON curso_catedratico.id_curso = cursos.id
             WHERE curso_catedratico.id_catedratico = ?
             ORDER BY cursos.nombre ASC`,
            [id]
        );

        res.json(resultado);

    } catch (error) {
        console.error('Error al obtener cursos del catedrático:', error);

        res.status(500).json({
            mensaje: 'Error al obtener cursos del catedrático'
        });
    }
};

module.exports = {
    obtenerCatedraticos,
    obtenerCursosPorCatedratico
};