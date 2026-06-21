const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validarRequisicao = require('../middlewares/validador');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('O nome é obrigatório'),
    body('email').isEmail().withMessage('Insira um e-mail válido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Cargo inválido')
  ],
  validarRequisicao,
  authController.registrar
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Insira um e-mail válido').normalizeEmail(),
    body('password').notEmpty().withMessage('A senha é obrigatória')
  ],
  validarRequisicao,
  authController.login
);

module.exports = router;
