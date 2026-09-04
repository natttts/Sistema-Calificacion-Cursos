
const express = require('express');
const { registrarUsuario, iniciarSesion, recuperarPassword, obtenerUsuario,
    obtenerCursosAprobados, agregarCursoAprobado, eliminarCursoAprobado, obtenerTotalCreditos, buscarUsuarioPorRegistro,
    actualizarUsuario, obtenerPerfilCompleto
 } = require('../controladores/usuariosController');

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);
router.post('/recuperar', recuperarPassword);
router.get('/buscar/:registro_academico', buscarUsuarioPorRegistro);
router.get('/perfil/:registro_academico', obtenerPerfilCompleto);
router.get('/:id', obtenerUsuario);
router.put('/:id', actualizarUsuario);
router.get('/:id/cursos-aprobados', obtenerCursosAprobados);
router.post('/:id/cursos-aprobados', agregarCursoAprobado);
router.delete('/:id/cursos-aprobados/:id_curso', eliminarCursoAprobado);
router.get('/:id/total-creditos', obtenerTotalCreditos);

module.exports = router;