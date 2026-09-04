
const express = require('express');

const {
    crearPublicacion,
    obtenerPublicaciones
} = require('../controladores/publicacionesController');

const router = express.Router();

router.post('/', crearPublicacion);
router.get('/', obtenerPublicaciones);

module.exports = router;