import { TItemData } from './../src/types/ItemsTypes';
import app from '../src/app';
import supertest from 'supertest';
import { prisma } from '../src/database';
import { newItem, insert } from './factories/itemsFactory';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE  items`;
});

const agent = supertest(app);

describe('Testa POST /items ', () => {

  it('Deve retornar 201, se cadastrado um item no formato correto', async() => {
    const item = newItem();
    const response = await agent.post('/items').send(item);
    expect(response.status).toBe(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async() => {
    const item = newItem();
    await insert(item);
    const response = await agent.post('/items').send(item);
    expect(response.status).toBe(409);
  });

});

describe('Testa GET /items ', () => {

  it('Deve retornar status 200 e o body no formato de Array', async() => {
    const response = await agent.get('/items');
    const result = Array.isArray(response.body);
    expect(result).toBe(true);
  });

});

describe('Testa GET /items/:id ', () => {

  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async() => {
    const item = newItem();
    const itemCreated = await insert(item);
    const response = await agent.get(`/items/${itemCreated.id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(itemCreated.title);
    expect(response.body.url).toBe(itemCreated.url);
    expect(response.body.amount).toBe(itemCreated.amount);
    expect(response.body.description).toBe(itemCreated.description);
  });

  it('Deve retornar status 404 caso não exista um item com esse id', async() => {
    const randomNumber = Math.floor(Math.random() * 100);
    const response = await agent.get(`/items/${randomNumber}`);
    expect(response.status).toBe(404);
  });

});

afterAll(async () => {
  await prisma.$disconnect();
});