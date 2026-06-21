const bcrypt = require('bcryptjs');
const User = require('../models/User');

const listar = async (req, res, next) => {
  try {
    const usuarios = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    return res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
};

const buscarPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

const criar = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const usuarioExiste = await User.findOne({ where: { email } });
    if (usuarioExiste) {
      return res.status(400).json({ erro: 'E-mail já cadastrado' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const novoUsuario = await User.create({
      name,
      email,
      password: passwordHash,
      role: role || 'user'
    });

    const userObj = novoUsuario.toJSON();
    delete userObj.password;

    return res.status(201).json(userObj);
  } catch (error) {
    next(error);
  }
};

const atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (email && email !== usuario.email) {
      const emailEmUso = await User.findOne({ where: { email } });
      if (emailEmUso) {
        return res.status(400).json({ erro: 'E-mail já está sendo utilizado por outro usuário' });
      }
      usuario.email = email;
    }

    if (name) usuario.name = name;
    if (role) usuario.role = role;

    if (password) {
      const salt = await bcrypt.genSalt(12);
      usuario.password = await bcrypt.hash(password, salt);
    }

    await usuario.save();

    const userObj = usuario.toJSON();
    delete userObj.password;

    return res.status(200).json(userObj);
  } catch (error) {
    next(error);
  }
};

const excluir = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await User.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    await usuario.destroy();
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
