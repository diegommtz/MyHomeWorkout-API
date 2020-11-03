const express = require('express');
const router = express.Router();
let musculoController = require('../controllers/musculo.controller');


// Ruta para llegar aquí: localhost:3000/musculo
router.post('/', musculoController.CreateMusculo);                    
router.get('/:idMusculo', musculoController.GetMusculo);
router.get('/', musculoController.GetAllMusculos);
router.put('/', musculoController.UpdateMusculo);
router.delete('/:idMusculo', musculoController.DeleteMusculo);

module.exports = router;