const express = require('express');
const router = express.Router();

const DepartamentosController = require('../controllers/DepartamentosController');

router.get('/list', DepartamentosController.list);


module.exports = router;