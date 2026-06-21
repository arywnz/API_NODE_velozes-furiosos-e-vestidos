const express = require('express');
const { body } = require('express-validator');
const marcaRoupaController = require('../controllers/marcaRoupaController');
const { autenticar } = require('../middlewares/auth');
const validarRequisicao = require('../middlewares/validador');

const router = express.Router();

router.use(autenticar);

router.get('/', marcaRoupaController.listar);
router.get('/:id', marcaRoupaController.buscarPorId);

router.post(
  '/',
  [
    body('nome').trim().notEmpty().withMessage('O nome da marca é obrigatório'),
    body('fundador').trim().notEmpty().withMessage('O nome do fundador é obrigatório'),
    body('anoFundacao').isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Ano de fundação inválido'),
    body('paisOrigem').trim().notEmpty().withMessage('O país de origem é obrigatório')
  ],
  validarRequisicao,
  marcaRoupaController.criar
);

router.put(
  '/:id',
  [
    body('nome').optional().trim().notEmpty().withMessage('O nome da marca não pode ser vazio'),
    body('fundador').optional().trim().notEmpty().withMessage('O nome do fundador não pode ser vazio'),
    body('anoFundacao').optional().isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Ano de fundação inválido'),
    body('paisOrigem').optional().trim().notEmpty().withMessage('O país de origem não pode ser vazio')
  ],
  validarRequisicao,
  marcaRoupaController.atualizar
);

router.delete('/:id', marcaRoupaController.excluir);

module.exports = router;
