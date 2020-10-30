const express = require('express');
const router = express.Router();
let objetivoController = require('../controllers/objetivo.controller');


// Ruta para llegar aquí: localhost:3000/objetivo
router.post('/', objetivoController.CreateObjetivo);                    
router.get('/:idObjetivo', objetivoController.GetObjetivo);
router.get('/', objetivoController.GetAllObjetivos);
router.put('/', objetivoController.UpdateObjetivo);
router.delete('/:idObjetivo', objetivoController.DeleteObjetivo);

module.exports = router;