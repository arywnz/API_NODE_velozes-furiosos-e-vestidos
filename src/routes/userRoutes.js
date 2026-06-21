const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { autenticar, autorizar } = require('../middlewares/auth');
const validarRequisicao = require('../middlewares/validador');

const router = express.Router();

router.use(autenticar);

router.get('/', autorizar(['admin']), userController.listar);

router.get('/:id', userController.buscarPorId);

router.post(
  '/',
  autorizar(['admin']),
  [
    body('name').trim().notEmpty().withMessage('O nome é obrigatório'),
    body('email').isEmail().withMessage('Insira um e-mail válido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Cargo inválido')
  ],
  validarRequisicao,
  userController.criar
);

router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('O nome não pode ser vazio'),
    body('email').optional().isEmail().withMessage('Insira um e-mail válido').normalizeEmail(),
    body('password').optional().isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Cargo inválido')
  ],
  validarRequisicao,
  userController.atualizar
);

router.delete('/:id', autorizar(['admin']), userController.excluir);

module.exports = router;
