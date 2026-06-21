const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');

require('./setup');

describe('Testes de Autenticação e Usuários', () => {
  it('deve registrar um novo usuário com sucesso', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('admin@test.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('deve falhar ao registrar usuário com e-mail duplicado', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'User 1',
        email: 'user@test.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'User 2',
        email: 'user@test.com',
        password: 'password456'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('deve fazer login com sucesso e retornar um token JWT', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'User Log',
        email: 'login@test.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.email).toBe('login@test.com');
  });

  it('não deve acessar rotas protegidas sem token', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(401);
  });

  it('não deve permitir que usuário comum liste todos os usuários', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'User Comum',
        email: 'comum@test.com',
        password: 'password123',
        role: 'user'
      });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'comum@test.com',
        password: 'password123'
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('deve permitir que administrador liste usuários', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'User Admin',
        email: 'adm@test.com',
        password: 'password123',
        role: 'admin'
      });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'adm@test.com',
        password: 'password123'
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
