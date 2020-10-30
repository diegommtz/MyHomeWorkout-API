const express = require('express');
const router = express.Router();
let fotoController = require('../controllers/foto.controller');


// Ruta para llegar aquí: localhost:3000/foto
router.post('/:idPersona/:idFoto', fotoController.CreateFoto);
router.get('/:idPersona/:idFoto', fotoController.GetFotoPersona);
router.get('/:idPersona', fotoController.GetFotosPersona);
router.delete('/:idPersona', fotoController.DeletePersonaFotos);
router.delete('/:idPersona/:idFoto', fotoController.DeleteFoto);


module.exports = router;