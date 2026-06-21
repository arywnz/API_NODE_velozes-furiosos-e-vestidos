const request = require('supertest');
const app = require('../src/app');

require('./setup');

describe('Testes do CRUD de Carros (NoSQL)', () => {
  let token;

  beforeEach(async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testcar@test.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'testcar@test.com',
        password: 'password123'
      });

    token = res.body.token;
  });

  it('deve criar um novo carro', async () => {
    const res = await request(app)
      .post('/carros')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Ford',
        modelo: 'Mustang',
        ano: 2022,
        cor: 'Preto',
        preco: 350000.00
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.modelo).toBe('Mustang');
  });

  it('deve listar os carros cadastrados', async () => {
    await request(app)
      .post('/carros')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Chevrolet',
        modelo: 'Onix',
        ano: 2021,
        cor: 'Prata',
        preco: 80000.00
      });

    const res = await request(app)
      .get('/carros')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('deve buscar um carro pelo id', async () => {
    const creationRes = await request(app)
      .post('/carros')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2020,
        cor: 'Branco',
        preco: 120000.00
      });

    const id = creationRes.body._id;

    const res = await request(app)
      .get(`/carros/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.modelo).toBe('Corolla');
  });

  it('deve atualizar um carro', async () => {
    const creationRes = await request(app)
      .post('/carros')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2019,
        cor: 'Cinza',
        preco: 110000.00
      });

    const id = creationRes.body._id;

    const res = await request(app)
      .put(`/carros/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        preco: 115000.00,
        cor: 'Azul'
      });

    expect(res.status).toBe(200);
    expect(res.body.cor).toBe('Azul');
    expect(res.body.preco).toBe(115000.00);
  });

  it('deve deletar um carro', async () => {
    const creationRes = await request(app)
      .post('/carros')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Fiat',
        modelo: 'Uno',
        ano: 2015,
        cor: 'Vermelho',
        preco: 30000.00
      });

    const id = creationRes.body._id;

    const res = await request(app)
      .delete(`/carros/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);

    const getRes = await request(app)
      .get(`/carros/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});
