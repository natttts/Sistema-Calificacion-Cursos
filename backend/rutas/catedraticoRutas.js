
const express = require('express');

const {
    obtenerCatedraticos,
    obtenerCursosPorCatedratico
} = require('../controladores/catedraticosController');

const router = express.Router();

router.get('/', obtenerCatedraticos);

router.get('/:id/cursos', obtenerCursosPorCatedratico);

module.exports = router;