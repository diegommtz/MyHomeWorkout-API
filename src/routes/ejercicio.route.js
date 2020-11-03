const express = require('express');
const router = express.Router();
let ejercicioController = require('../controllers/ejercicio.controller');


// Ruta para llegar aquí: localhost:3000/ejercicio
router.post('/', ejercicioController.CreateEjercicio);                    
router.get('/:idEjercicio', ejercicioController.GetEjercicio);
router.get('/', ejercicioController.GetAllEjercicios);
router.put('/', ejercicioController.UpdateEjercicio);
router.delete('/:idEjercicio', ejercicioController.DeleteEjercicio);

module.exports = router;