const jwt = require('jsonwebtoken');
const User = require('../models/User');

const autenticar = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido ou inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_super_secreto_da_api_12345');
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};

const autorizar = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: 'Não autenticado' });
    }

    if (rolesPermitidos.length && !rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ erro: 'Acesso proibido para este nível de permissão' });
    }

    next();
  };
};

module.exports = {
  autenticar,
  autorizar
};
