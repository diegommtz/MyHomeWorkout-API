const express = require('express');
const router = express.Router();
let horarioController = require('../controllers/horario.controller');


// Ruta para llegar aquí: localhost:3000/horario
router.post('/:idPersona', horarioController.CreateHorario);                    
router.get('/:idPersona', horarioController.GetHorario);
router.get('/', horarioController.GetAllHorarios);
router.put('/:idPersona', horarioController.UpdateHorario);
router.delete('/:idPersona', horarioController.DeleteHorario);

module.exports = router;