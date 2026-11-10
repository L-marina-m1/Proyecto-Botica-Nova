const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate');
const { verificarToken } = require('../middlewares/auth');
const c = require('../controllers/ventas.controller');

router.use(verificarToken);
router.get('/', c.listar);
router.get('/:id', param('id').isInt({ min: 1 }), validate, c.obtener);
router.post('/',
  body('cliente').optional({ nullable: true }).isLength({ max: 120 }),
  body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  body('items.*.producto_id').isInt({ min: 1 }).withMessage('producto_id inválido').toInt(),
  body('items.*.cantidad').isInt({ min: 1 }).withMessage('cantidad debe ser entero >= 1').toInt(),
  validate, c.registrar);

module.exports = router;
