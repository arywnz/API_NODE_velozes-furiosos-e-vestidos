const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registrar = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const usuarioExiste = await User.findOne({ where: { email } });
    if (usuarioExiste) {
      return res.status(400).json({ erro: 'Este e-mail já está em uso' });
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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET || 'segredo_super_secreto_da_api_12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrar,
  login
};
