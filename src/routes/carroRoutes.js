const express = require('express');
const { body } = require('express-validator');
const carroController = require('../controllers/carroController');
const { autenticar } = require('../middlewares/auth');
const validarRequisicao = require('../middlewares/validador');

const router = express.Router();

router.use(autenticar);

router.get('/', carroController.listar);
router.get('/:id', carroController.buscarPorId);

router.post(
  '/',
  [
    body('marca').trim().notEmpty().withMessage('A marca é obrigatória'),
    body('modelo').trim().notEmpty().withMessage('O modelo é obrigatório'),
    body('ano').isInt({ min: 1886 }).withMessage('Ano do carro inválido'),
    body('cor').trim().notEmpty().withMessage('A cor é obrigatória'),
    body('preco').isFloat({ min: 0 }).withMessage('O preço deve ser um número positivo')
  ],
  validarRequisicao,
  carroController.criar
);

router.put(
  '/:id',
  [
    body('marca').optional().trim().notEmpty().withMessage('A marca não pode ser vazia'),
    body('modelo').optional().trim().notEmpty().withMessage('O modelo não pode ser vazio'),
    body('ano').optional().isInt({ min: 1886 }).withMessage('Ano do carro inválido'),
    body('cor').optional().trim().notEmpty().withMessage('A cor não pode ser vazia'),
    body('preco').optional().isFloat({ min: 0 }).withMessage('O preço deve ser um número positivo')
  ],
  validarRequisicao,
  carroController.atualizar
);

router.delete('/:id', carroController.excluir);

module.exports = router;
