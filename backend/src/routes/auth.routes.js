const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { verificarToken, soloRoles } = require('../middlewares/auth');
const c = require('../controllers/auth.controller');

router.post('/login',
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  validate, c.login);

router.post('/registrar', verificarToken, soloRoles('admin'),
  body('nombre').trim().notEmpty().withMessage('Nombre obligatorio'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  body('rol').optional().isIn(['admin', 'vendedor']).withMessage('Rol inválido'),
  validate, c.registrar);

router.get('/perfil', verificarToken, c.perfil);

module.exports = router;
