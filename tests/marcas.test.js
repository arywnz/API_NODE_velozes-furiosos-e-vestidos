const request = require('supertest');
const app = require('../src/app');

require('./setup');

describe('Testes do CRUD de Marcas de Roupa (NoSQL)', () => {
  let token;

  beforeEach(async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testbrand@test.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'testbrand@test.com',
        password: 'password123'
      });

    token = res.body.token;
  });

  it('deve criar uma nova marca de roupa', async () => {
    const res = await request(app)
      .post('/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Gucci',
        fundador: 'Guccio Gucci',
        anoFundacao: 1921,
        paisOrigem: 'Itália'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.nome).toBe('Gucci');
  });

  it('deve listar as marcas de roupa cadastradas', async () => {
    await request(app)
      .post('/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Nike',
        fundador: 'Phil Knight',
        anoFundacao: 1964,
        paisOrigem: 'EUA'
      });

    const res = await request(app)
      .get('/marcas-roupa')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('deve buscar uma marca de roupa pelo id', async () => {
    const creationRes = await request(app)
      .post('/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Adidas',
        fundador: 'Adolf Dassler',
        anoFundacao: 1949,
        paisOrigem: 'Alemanha'
      });

    const id = creationRes.body._id;

    const res = await request(app)
      .get(`/marcas-roupa/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Adidas');
  });

  it('deve atualizar uma marca de roupa', async () => {
    const creationRes = await request(app)
      .post('/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Zara',
        fundador: 'Amancio Ortega',
        anoFundacao: 1975,
        paisOrigem: 'Espanha'
      });

    const id = creationRes.body._id;

    const res = await request(app)
      .put(`/marcas-roupa/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        fundador: 'Amancio Ortega Gaona',
        anoFundacao: 1974
      });

    expect(res.status).toBe(200);
    expect(res.body.fundador).toBe('Amancio Ortega Gaona');
    expect(res.body.anoFundacao).toBe(1974);
  });

  it('deve deletar uma marca de roupa', async () => {
    const creationRes = await request(app)
      .post('/marcas-roupa')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Prada',
        fundador: 'Mario Prada',
        anoFundacao: 1913,
        paisOrigem: 'Itália'
      });

    const id = creationRes.body._id;

    const res = await request(app)
      .delete(`/marcas-roupa/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);

    const getRes = await request(app)
      .get(`/marcas-roupa/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});
