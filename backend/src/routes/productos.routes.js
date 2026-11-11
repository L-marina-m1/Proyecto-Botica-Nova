const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate');
const { verificarToken, soloRoles } = require('../middlewares/auth');
const c = require('../controllers/productos.controller');

const id = param('id').isInt({ min: 1 }).withMessage('ID inválido');
const datos = [
 body('nombre').trim().notEmpty().withMessage('Nombre obligatorio').isLength({ max: 120 }),
 body('descripcion').optional({ nullable: true }).isLength({ max: 255 }),
 body('categoria_id').isInt({ min: 1 }).withMessage('Categoría inválida'),
 body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser >= 0'),
 body('stock').optional().isInt({ min: 0 }).withMessage('Stock debe ser entero >= 0'),
 body('stock_minimo').optional().isInt({ min: 0 }).withMessage('Stock mínimo debe ser entero >= 0'),
];

router.use(verificarToken);
router.get('/', c.listar);
router.get('/:id', id, validate, c.obtener);
router.post('/', soloRoles('admin'), datos, validate, c.crear);
router.put('/:id', soloRoles('admin'), id, datos, validate, c.actualizar);
router.patch('/:id/estado', soloRoles('admin'), id,
 body('activo').isBoolean().withMessage('Estado inválido').toBoolean(),
 validate, c.cambiarEstado);
router.delete('/:id', soloRoles('admin'), id, validate, c.eliminar);

module.exports = router;