const express = require('express');
const router = express.Router();
let personaController = require('../controllers/persona.controller');


// Ruta para llegar aquí: localhost:3000/persona
router.post('/', personaController.CreatePersona);                    
router.get('/:idPersona', personaController.GetPersona);
router.post('/login/:nombrePersona/:contrasena', personaController.Login);
router.post('/entrenamiento/:idPersona', personaController.AumentarEntrenamiento);
router.get('/', personaController.GetAllPersonas);
router.put('/', personaController.UpdatePersona);
router.delete('/:idPersona', personaController.DeletePersona);

module.exports = router;