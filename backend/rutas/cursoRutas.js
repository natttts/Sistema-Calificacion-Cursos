
const express = require('express');

const {
    obtenerCursos
} = require('../controladores/cursosController');

const router = express.Router();

router.get('/', obtenerCursos);

module.exports = router;