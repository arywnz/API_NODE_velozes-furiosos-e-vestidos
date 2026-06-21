const request = require('supertest');
const app = require('../src/app');

require('./setup');

describe('Testes do CRUD de Motos (NoSQL)', () => {
  let token;

  beforeEach(async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'testmoto@test.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'testmoto@test.com',
        password: 'password123'
      });

    token = res.body.token;
  });

  it('deve criar uma nova moto', async () => {
    const res = await request(app)
      .post('/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Honda',
        modelo: 'CB 500',
        ano: 2021,
        cilindrada: 500,
        preco: 38000.00
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.modelo).toBe('CB 500');
  });

  it('deve listar as motos cadastradas', async () => {
    await request(app)
      .post('/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Yamaha',
        modelo: 'MT-07',
        ano: 2022,
        cilindrada: 689,
        preco: 45000.00
      });

    const res = await request(app)
      .get('/motos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('deve buscar uma moto pelo id', async () => {
    const creationRes = await request(app)
      .post('/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'BMW',
        modelo: 'F 850 GS',
        ano: 2020,
        cilindrada: 850,
        preco: 65000.00
      });

    const id = creationRes.body._id;

    const res = await request(app)
      .get(`/motos/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.modelo).toBe('F 850 GS');
  });

  it('deve atualizar uma moto', async () => {
    const creationRes = await request(app)
      .post('/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Kawasaki',
        modelo: 'Ninja 400',
        ano: 2019,
        cilindrada: 400,
        preco: 32000.00
      });

    const id = creationRes.body._id;

    const res = await request(app)
      .put(`/motos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        preco: 34000.00,
        ano: 2020
      });

    expect(res.status).toBe(200);
    expect(res.body.preco).toBe(34000.00);
    expect(res.body.ano).toBe(2020);
  });

  it('deve deletar uma moto', async () => {
    const creationRes = await request(app)
      .post('/motos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marca: 'Suzuki',
        modelo: 'Yes 125',
        ano: 2012,
        cilindrada: 125,
        preco: 6000.00
      });

    const id = creationRes.body._id;

    const res = await request(app)
      .delete(`/motos/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);

    const getRes = await request(app)
      .get(`/motos/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});
