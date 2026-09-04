
const express = require('express');

const {
    crearComentario,
    obtenerComentariosPorPublicacion
} = require('../controladores/comentariosController');

const router = express.Router();

router.post('/', crearComentario);
router.get('/publicacion/:id_publicacion', obtenerComentariosPorPublicacion);

module.exports = router;
