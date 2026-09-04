
const conexion = require('../config/db');

const registrarUsuario = async (req, res) => {
    try {
        const {
            registro_academico,
            nombres,
            apellidos,
            correo,
            password
        } = req.body;

        if (!registro_academico || !nombres || !apellidos || !correo || !password) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const [resultado] = await conexion.query(
            `INSERT INTO usuarios
            (registro_academico, nombres, apellidos, correo, password)
            VALUES (?, ?, ?, ?, ?)`,
            [registro_academico, nombres, apellidos, correo, password]
        );

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);

        res.status(500).json({
            mensaje: 'Error al registrar usuario'
        });
    }
};

const iniciarSesion = async (req, res) => {
    try {
        const { registro_academico, password } = req.body;

        if (!registro_academico || !password) {
            return res.status(400).json({
                mensaje: 'El registro académico y la contraseña son obligatorios'
            });
        }

        const [resultado] = await conexion.query(
            `SELECT id, registro_academico, nombres, apellidos, correo
             FROM usuarios
             WHERE registro_academico = ? AND password = ?`,
            [registro_academico, password]
        );

        if (resultado.length === 0) {
            return res.status(401).json({
                mensaje: 'Registro académico o contraseña incorrectos'
            });
        }

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: resultado[0]
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        res.status(500).json({
            mensaje: 'Error al iniciar sesión'
        });
    }
};

const recuperarPassword = async (req, res) => {
    try {
        const { registro_academico, correo, nueva_password } = req.body;

        if (!registro_academico || !correo || !nueva_password) {
            return res.status(400).json({
                mensaje: 'El registro académico, correo y nueva contraseña son obligatorios'
            });
        }

        const [resultado] = await conexion.query(
            `SELECT id
             FROM usuarios
             WHERE registro_academico = ? AND correo = ?`,
            [registro_academico, correo]
        );

        if (resultado.length === 0) {
            return res.status(404).json({
                mensaje: 'El registro académico y correo no coinciden'
            });
        }

        await conexion.query(
            `UPDATE usuarios
             SET password = ?
             WHERE id = ?`,
            [nueva_password, resultado[0].id]
        );

        res.json({
            mensaje: 'Contraseña actualizada correctamente'
        });

    } catch (error) {
        console.error('Error al recuperar contraseña:', error);

        res.status(500).json({
            mensaje: 'Error al recuperar contraseña'
        });
    }
};

const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexion.query(
            `SELECT id, registro_academico, nombres, apellidos, correo
             FROM usuarios
             WHERE id = ?`,
            [id]
        );

        if (resultado.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json(resultado[0]);

    } catch (error) {
        console.error('Error al obtener usuario:', error);

        res.status(500).json({
            mensaje: 'Error al obtener usuario'
        });
    }
};

//para obtener los cursos aprobados
const obtenerCursosAprobados = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexion.query(
            `SELECT cursos.id, cursos.nombre, cursos.creditos
             FROM cursos_aprobados
             INNER JOIN cursos
             ON cursos_aprobados.id_curso = cursos.id
             WHERE cursos_aprobados.id_usuario = ?`,
            [id]
        );

        res.json({
            usuario: id,
            cursos_aprobados: resultado
        });

    } catch (error) {
        console.error('Error al obtener cursos aprobados:', error);

        res.status(500).json({
            mensaje: 'Error al obtener cursos aprobados'
        });
    }
};

const agregarCursoAprobado = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_curso } = req.body;

        if (!id_curso) {
            return res.status(400).json({
                mensaje: 'El id del curso es obligatorio'
            });
        }

        await conexion.query(
            `INSERT INTO cursos_aprobados (id_usuario, id_curso)
             VALUES (?, ?)`,
            [id, id_curso]
        );

        res.status(201).json({
            mensaje: 'Curso aprobado agregado correctamente'
        });

    } catch (error) {
        console.error('Error al agregar curso aprobado:', error);

        res.status(500).json({
            mensaje: 'Error al agregar curso aprobado'
        });
    }
};

//para eliminar el curso
const eliminarCursoAprobado = async (req, res) => {
    try {
        const { id, id_curso } = req.params;

        await conexion.query(
            `DELETE FROM cursos_aprobados
             WHERE id_usuario = ? AND id_curso = ?`,
            [id, id_curso]
        );

        res.json({
            mensaje: 'Curso aprobado eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar curso aprobado:', error);

        res.status(500).json({
            mensaje: 'Error al eliminar curso aprobado'
        });
    }
};

//para tener el total de creditos 
const obtenerTotalCreditos = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexion.query(
            `SELECT COALESCE(SUM(cursos.creditos), 0) AS total_creditos
             FROM cursos_aprobados
             INNER JOIN cursos
             ON cursos_aprobados.id_curso = cursos.id
             WHERE cursos_aprobados.id_usuario = ?`,
            [id]
        );

        res.json({
            usuario: id,
            total_creditos: resultado[0].total_creditos
        });

    } catch (error) {
        console.error('Error al obtener total de créditos:', error);

        res.status(500).json({
            mensaje: 'Error al obtener total de créditos'
        });
    }
};

const buscarUsuarioPorRegistro = async (req, res) => {
    try {
        const { registro_academico } = req.params;

        const [resultado] = await conexion.query(
            `SELECT id, registro_academico, nombres, apellidos, correo
             FROM usuarios
             WHERE registro_academico = ?`,
            [registro_academico]
        );

        if (resultado.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json(resultado[0]);

    } catch (error) {
        console.error('Error al buscar usuario:', error);

        res.status(500).json({
            mensaje: 'Error al buscar usuario'
        });
    }
};


//sirve para poder editar los datos menos el registro academico
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombres,
            apellidos,
            correo,
            password
        } = req.body;

        if (!nombres || !apellidos || !correo || !password) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const [resultado] = await conexion.query(
            `UPDATE usuarios
             SET nombres = ?, apellidos = ?, correo = ?, password = ?
             WHERE id = ?`,
            [nombres, apellidos, correo, password, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json({
            mensaje: 'Usuario actualizado correctamente'
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);

        res.status(500).json({
            mensaje: 'Error al actualizar usuario'
        });
    }
};

//para ver el perfil con registro academico 
const obtenerPerfilCompleto = async (req, res) => {
    try {
        const { registro_academico } = req.params;

        // Buscar usuario
        const [usuarios] = await conexion.query(
            `SELECT id, registro_academico, nombres, apellidos, correo
             FROM usuarios
             WHERE registro_academico = ?`,
            [registro_academico]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const usuario = usuarios[0];

        // Buscar cursos aprobados
        const [cursos] = await conexion.query(
            `SELECT cursos.id, cursos.nombre, cursos.creditos
             FROM cursos_aprobados
             INNER JOIN cursos
                ON cursos_aprobados.id_curso = cursos.id
             WHERE cursos_aprobados.id_usuario = ?
             ORDER BY cursos.nombre ASC`,
            [usuario.id]
        );

        // Calcular créditos
        const totalCreditos = cursos.reduce(
            (total, curso) => total + curso.creditos,
            0
        );

        res.json({
            usuario: {
                id: usuario.id,
                registro_academico: usuario.registro_academico,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                correo: usuario.correo
            },
            cursos_aprobados: cursos,
            total_creditos: totalCreditos
        });

    } catch (error) {
        console.error('Error al obtener perfil completo:', error);

        res.status(500).json({
            mensaje: 'Error al obtener perfil completo'
        });
    }
};

    module.exports = {
      registrarUsuario,
       iniciarSesion,
       recuperarPassword,
       obtenerUsuario,
       obtenerCursosAprobados,
       agregarCursoAprobado,
       eliminarCursoAprobado,
       obtenerTotalCreditos,
       buscarUsuarioPorRegistro,
       actualizarUsuario,
       obtenerPerfilCompleto
    };

