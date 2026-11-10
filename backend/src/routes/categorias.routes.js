const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate');
const { verificarToken, soloRoles } = require('../middlewares/auth');
const c = require('../controllers/categorias.controller');

const datos = [
  body('nombre').trim().notEmpty().withMessage('Nombre obligatorio').isLength({ max: 80 }),
  body('descripcion').optional({ nullable: true }).isLength({ max: 255 }),
];
const id = param('id').isInt({ min: 1 }).withMessage('ID inválido');

router.use(verificarToken);
router.get('/', c.listar);
router.post('/', soloRoles('admin'), datos, validate, c.crear);
router.put('/:id', soloRoles('admin'), id, datos, validate, c.actualizar);
router.delete('/:id', soloRoles('admin'), id, validate, c.eliminar);

module.exports = router;
