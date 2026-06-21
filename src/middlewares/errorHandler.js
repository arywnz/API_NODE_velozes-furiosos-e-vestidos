const tratadorErros = (err, req, res, next) => {
  const status = err.status || 500;
  const mensagem = err.message || 'Erro interno do servidor';
  
  if (process.env.NODE_ENV === 'production') {
    return res.status(status).json({ erro: status === 500 ? 'Erro interno do servidor' : mensagem });
  }

  return res.status(status).json({
    erro: mensagem,
    stack: err.stack
  });
};

module.exports = tratadorErros;
