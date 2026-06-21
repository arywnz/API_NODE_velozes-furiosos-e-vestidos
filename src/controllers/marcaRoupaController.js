const MarcaRoupa = require('../models/MarcaRoupa');

const listar = async (req, res, next) => {
  try {
    const marcas = await MarcaRoupa.find();
    return res.status(200).json(marcas);
  } catch (error) {
    next(error);
  }
};

const buscarPorId = async (req, res, next) => {
  try {
    const marca = await MarcaRoupa.findById(req.params.id);
    if (!marca) {
      return res.status(404).json({ erro: 'Marca de roupa não encontrada' });
    }
    return res.status(200).json(marca);
  } catch (error) {
    next(error);
  }
};

const criar = async (req, res, next) => {
  try {
    const { nome, fundador, anoFundacao, paisOrigem } = req.body;
    const novaMarca = new MarcaRoupa({ nome, fundador, anoFundacao, paisOrigem });
    await novaMarca.save();
    return res.status(201).json(novaMarca);
  } catch (error) {
    next(error);
  }
};

const atualizar = async (req, res, next) => {
  try {
    const { nome, fundador, anoFundacao, paisOrigem } = req.body;
    const marca = await MarcaRoupa.findByIdAndUpdate(
      req.params.id,
      { nome, fundador, anoFundacao, paisOrigem },
      { new: true, runValidators: true }
    );
    if (!marca) {
      return res.status(404).json({ erro: 'Marca de roupa não encontrada' });
    }
    return res.status(200).json(marca);
  } catch (error) {
    next(error);
  }
};

const excluir = async (req, res, next) => {
  try {
    const marca = await MarcaRoupa.findByIdAndDelete(req.params.id);
    if (!marca) {
      return res.status(404).json({ erro: 'Marca de roupa não encontrada' });
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
