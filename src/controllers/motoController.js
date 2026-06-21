const Moto = require('../models/Moto');

const listar = async (req, res, next) => {
  try {
    const motos = await Moto.find();
    return res.status(200).json(motos);
  } catch (error) {
    next(error);
  }
};

const buscarPorId = async (req, res, next) => {
  try {
    const moto = await Moto.findById(req.params.id);
    if (!moto) {
      return res.status(404).json({ erro: 'Moto não encontrada' });
    }
    return res.status(200).json(moto);
  } catch (error) {
    next(error);
  }
};

const criar = async (req, res, next) => {
  try {
    const { marca, modelo, ano, cilindrada, preco } = req.body;
    const novaMoto = new Moto({ marca, modelo, ano, cilindrada, preco });
    await novaMoto.save();
    return res.status(201).json(novaMoto);
  } catch (error) {
    next(error);
  }
};

const atualizar = async (req, res, next) => {
  try {
    const { marca, modelo, ano, cilindrada, preco } = req.body;
    const moto = await Moto.findByIdAndUpdate(
      req.params.id,
      { marca, modelo, ano, cilindrada, preco },
      { new: true, runValidators: true }
    );
    if (!moto) {
      return res.status(404).json({ erro: 'Moto não encontrada' });
    }
    return res.status(200).json(moto);
  } catch (error) {
    next(error);
  }
};

const excluir = async (req, res, next) => {
  try {
    const moto = await Moto.findByIdAndDelete(req.params.id);
    if (!moto) {
      return res.status(404).json({ erro: 'Moto não encontrada' });
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
