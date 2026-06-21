require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const { connectMongoDB } = require('./config/nosql');
require('./models/User');

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await sequelize.sync();
    await connectMongoDB();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();
