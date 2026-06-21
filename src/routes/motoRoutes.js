const express = require('express');
const { body } = require('express-validator');
const motoController = require('../controllers/motoController');
const { autenticar } = require('../middlewares/auth');
const validarRequisicao = require('../middlewares/validador');

const router = express.Router();

router.use(autenticar);

router.get('/', motoController.listar);
router.get('/:id', motoController.buscarPorId);

router.post(
  '/',
  [
    body('marca').trim().notEmpty().withMessage('A marca é obrigatória'),
    body('modelo').trim().notEmpty().withMessage('O modelo é obrigatório'),
    body('ano').isInt({ min: 1885 }).withMessage('Ano da moto inválido'),
    body('cilindrada').isInt({ min: 1 }).withMessage('A cilindrada deve ser um número inteiro positivo'),
    body('preco').isFloat({ min: 0 }).withMessage('O preço deve ser um número positivo')
  ],
  validarRequisicao,
  motoController.criar
);

router.put(
  '/:id',
  [
    body('marca').optional().trim().notEmpty().withMessage('A marca não pode ser vazia'),
    body('modelo').optional().trim().notEmpty().withMessage('O modelo não pode ser vazio'),
    body('ano').optional().isInt({ min: 1885 }).withMessage('Ano da moto inválido'),
    body('cilindrada').optional().isInt({ min: 1 }).withMessage('A cilindrada deve ser um número inteiro positivo'),
    body('preco').optional().isFloat({ min: 0 }).withMessage('O preço deve ser um número positivo')
  ],
  validarRequisicao,
  motoController.atualizar
);

router.delete('/:id', motoController.excluir);

module.exports = router;
