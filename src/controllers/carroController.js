const Carro = require('../models/Carro');

const listar = async (req, res, next) => {
  try {
    const carros = await Carro.find();
    return res.status(200).json(carros);
  } catch (error) {
    next(error);
  }
};

const buscarPorId = async (req, res, next) => {
  try {
    const carro = await Carro.findById(req.params.id);
    if (!carro) {
      return res.status(404).json({ erro: 'Carro não encontrado' });
    }
    return res.status(200).json(carro);
  } catch (error) {
    next(error);
  }
};

const criar = async (req, res, next) => {
  try {
    const { marca, modelo, ano, cor, preco } = req.body;
    const novoCarro = new Carro({ marca, modelo, ano, cor, preco });
    await novoCarro.save();
    return res.status(201).json(novoCarro);
  } catch (error) {
    next(error);
  }
};

const atualizar = async (req, res, next) => {
  try {
    const { marca, modelo, ano, cor, preco } = req.body;
    const carro = await Carro.findByIdAndUpdate(
      req.params.id,
      { marca, modelo, ano, cor, preco },
      { new: true, runValidators: true }
    );
    if (!carro) {
      return res.status(404).json({ erro: 'Carro não encontrado' });
    }
    return res.status(200).json(carro);
  } catch (error) {
    next(error);
  }
};

const excluir = async (req, res, next) => {
  try {
    const carro = await Carro.findByIdAndDelete(req.params.id);
    if (!carro) {
      return res.status(404).json({ erro: 'Carro não encontrado' });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir
};
