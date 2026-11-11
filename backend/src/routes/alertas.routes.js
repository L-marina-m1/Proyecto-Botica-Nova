const router = require('express').Router();
const { verificarToken } = require('../middlewares/auth');
const c = require('../controllers/alertas.controller');

router.get('/bajo-stock', verificarToken, c.bajoStock);

module.exports = router;
