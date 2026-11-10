const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate');
const { verificarToken, soloRoles } = require('../middlewares/auth');
const c = require('../controllers/usuarios.controller');

const id = param('id').isInt({ min: 1 }).withMessage('ID inválido');

// Todo este módulo es solo para administradores
router.use(verificarToken, soloRoles('admin'));

router.get('/', c.listar);

router.post('/',
  body('nombre').trim().notEmpty().withMessage('Nombre obligatorio').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('rol').optional().isIn(['admin', 'vendedor']).withMessage('Rol inválido'),
  validate, c.crear);

router.put('/:id', id,
  body('nombre').optional().trim().notEmpty().withMessage('Nombre obligatorio').isLength({ max: 100 }),
  body('email').optional().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').optional({ checkFalsy: true }).isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('rol').optional().isIn(['admin', 'vendedor']).withMessage('Rol inválido'),
  body('activo').optional().isBoolean().withMessage('Estado inválido').toBoolean(),
  validate, c.actualizar);

module.exports = router;