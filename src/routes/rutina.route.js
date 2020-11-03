const express = require('express');
const router = express.Router();
let rutinaController = require('../controllers/rutina.controller');


// Ruta para llegar aquí: localhost:3000/rutina
router.post('/', rutinaController.CreateRutina);                    
router.get('/:idRutina', rutinaController.GetRutina);
router.get('/', rutinaController.GetAllRutinas);
router.put('/', rutinaController.UpdateRutina);
router.delete('/:idRutina', rutinaController.DeleteRutina);

module.exports = router;