const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const limitador = require('./middlewares/rateLimiter');
const tratadorErros = require('./middlewares/errorHandler');
const swaggerOptions = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const carroRoutes = require('./routes/carroRoutes');
const motoRoutes = require('./routes/motoRoutes');
const marcaRoupaRoutes = require('./routes/marcaRoupaRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(limitador);
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/carros', carroRoutes);
app.use('/motos', motoRoutes);
app.use('/marcas-roupa', marcaRoupaRoutes);

app.use(tratadorErros);

module.exports = app;
