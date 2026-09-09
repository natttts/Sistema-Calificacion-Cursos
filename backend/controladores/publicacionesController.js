
const conexion = require('../config/db');

const crearPublicacion = async (req, res) => {
    try {
        const {
            id_usuario,
            id_curso,
            id_catedratico,
            contenido
        } = req.body;

        if (!id_usuario || !contenido) {
            return res.status(400).json({
                mensaje: 'El usuario y el contenido son obligatorios'
            });
        }

        if (!id_curso && !id_catedratico) {
            return res.status(400).json({
                mensaje: 'Debes indicar un curso o un catedrático'
            });
        }

        const [resultado] = await conexion.query(
            `INSERT INTO publicaciones
            (id_usuario, id_curso, id_catedratico, contenido)
            VALUES (?, ?, ?, ?)`,
            [
                id_usuario,
                id_curso || null,
                id_catedratico || null,
                contenido
            ]
        );

        res.status(201).json({
            mensaje: 'Publicación creada correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.error('Error al crear publicación:', error);

        res.status(500).json({
            mensaje: 'Error al crear publicación'
        });
    }
};


const obtenerPublicaciones = async (req, res) => {
    try {
        const {
            curso,
            catedratico,
            texto
        } = req.query;

        let consulta = `
            SELECT
                publicaciones.id,
                publicaciones.contenido AS contenido,
                publicaciones.fecha_hora,
                usuarios.id AS id_usuario,
                usuarios.registro_academico,
                usuarios.nombres,
                usuarios.apellidos,
                cursos.id AS id_curso,
                cursos.nombre AS curso,
                catedraticos.id AS id_catedratico,
                catedraticos.nombre AS catedratico
            FROM publicaciones
            INNER JOIN usuarios
                ON publicaciones.id_usuario = usuarios.id
            LEFT JOIN cursos
                ON publicaciones.id_curso = cursos.id
            LEFT JOIN catedraticos
                ON publicaciones.id_catedratico = catedraticos.id
            WHERE 1 = 1
        `;

        const parametros = [];

        if (curso) {
            consulta += ` AND cursos.id = ?`;
            parametros.push(curso);
        }

        if (catedratico) {
            consulta += ` AND catedraticos.id = ?`;
            parametros.push(catedratico);
        }

        if (texto) {
            consulta += `
                AND (
                    cursos.nombre LIKE ?
                    OR catedraticos.nombre LIKE ?
                    OR publicaciones.contenido LIKE ?
                )
            `;

            parametros.push(`%${texto}%`);
            parametros.push(`%${texto}%`);
            parametros.push(`%${texto}%`);
        }

        consulta += ` ORDER BY publicaciones.fecha_hora DESC`;

        const [resultado] = await conexion.query(
            consulta,
            parametros
        );

        res.json(resultado);

    } catch (error) {
        console.error('Error al obtener publicaciones:', error);

        res.status(500).json({
            mensaje: 'Error al obtener publicaciones'
        });
    }
};


module.exports = {
    crearPublicacion,
    obtenerPublicaciones
};