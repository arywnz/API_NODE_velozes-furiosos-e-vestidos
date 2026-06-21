const rateLimit = require('express-rate-limit');

const limitador = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { erro: 'Muitas requisições originadas deste IP, por favor tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = limitador;
