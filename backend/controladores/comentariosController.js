
const conexion = require('../config/db');

const crearComentario = async (req, res) => {
    try {
        const {
            id_publicacion,
            id_usuario,
            contenido
        } = req.body;

        if (!id_publicacion || !id_usuario || !contenido) {
            return res.status(400).json({
                mensaje: 'La publicación, el usuario y el contenido son obligatorios'
            });
        }

        const [resultado] = await conexion.query(
            `INSERT INTO comentarios
            (id_publicacion, id_usuario, contenido)
            VALUES (?, ?, ?)`,
            [
                id_publicacion,
                id_usuario,
                contenido
            ]
        );

        res.status(201).json({
            mensaje: 'Comentario creado correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.error('Error al crear comentario:', error);

        res.status(500).json({
            mensaje: 'Error al crear comentario'
        });
    }
};


const obtenerComentariosPorPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params;

        const [resultado] = await conexion.query(
            `SELECT
                comentarios.id,
                comentarios.contenido,
                comentarios.fecha_hora,
                usuarios.id AS id_usuario,
                usuarios.registro_academico,
                usuarios.nombres,
                usuarios.apellidos
             FROM comentarios
             INNER JOIN usuarios
                ON comentarios.id_usuario = usuarios.id
             WHERE comentarios.id_publicacion = ?
             ORDER BY comentarios.fecha_hora ASC`,
            [id_publicacion]
        );

        res.json(resultado);

    } catch (error) {
        console.error('Error al obtener comentarios:', error);

        res.status(500).json({
            mensaje: 'Error al obtener comentarios'
        });
    }
};


module.exports = {
    crearComentario,
    obtenerComentariosPorPublicacion
};