const sequelize = require('../src/config/database');
const { connectMongoDB, disconnectMongoDB } = require('../src/config/nosql');
const mongoose = require('mongoose');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await connectMongoDB();
});

afterAll(async () => {
  await sequelize.close();
  await disconnectMongoDB();
});

beforeEach(async () => {
  const models = Object.keys(sequelize.models);
  for (const modelName of models) {
    await sequelize.models[modelName].destroy({ where: {}, truncate: true, cascade: true });
  }

  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});
