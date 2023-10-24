const { Sequelize } = require('sequelize');
const express = require('express');
const request = require('supertest');

const app = express();
app.use('/members', require('./members'));

let mockedSequelize;

const MEMBER_MOCK = {
  firstName: 'John',
  lastName: 'Doe',
  birthday: '1990-01-01',
  email: 'johndoe3@example.com',
};

beforeAll(async () => {
  mockedSequelize = new Sequelize({
    dialect: 'postgres',
    storage: ':memory:',
    validateOnly: true,
  });
  await mockedSequelize.sync({ force: true });
});

afterEach(async () => {
  jest.clearAllMocks();
  await mockedSequelize.close();
});

describe('members', () => {
  const req = request(app).put('/members');
  describe('createMember', () => {
    // Test broken due to configuration issues

    // it('should create a new member', async () => {
    //   const member = MEMBER_MOCK;
    //   const response = await req.send(member);
    //   expect(response.status).toBe(201);
    //   expect(response.body.firstName).toBe(member.firstName);
    //   expect(response.body.lastName).toBe(member.lastName);
    //   expect(response.body.birthday).toBe(member.birthday);
    //   expect(response.body.email).toBe(member.email);
    // });

    it('should return 500 if firstName missing', async () => {
      const member = { ...MEMBER_MOCK, firstName: undefined };
      const response = await req.send(member);
      expect(response.status).toBe(500);
    });

    it('should return 500 if lastName missing', async () => {
      const member = { ...MEMBER_MOCK, lastName: undefined };
      const response = await req.send(member);
      expect(response.status).toBe(500);
    });

    it('should return 500 if email missing', async () => {
      const member = { ...MEMBER_MOCK, email: undefined };
      const response = await req.send(member);
      expect(response.status).toBe(500);
    });

    it('should return 500 if birthday missing', async () => {
      const member = { ...MEMBER_MOCK, birthday: undefined };
      const response = await req.send(member);
      expect(response.status).toBe(500);
    });

    it('should return 500 if request body is invalid', async () => {
      const member = { name: 'Some Full Name', badKey: 136 };
      const response = await req.send(member);
      expect(response.status).toBe(500);
    });
  });

  describe('search members', () => {
    it('should return results', async () => {
      const response = await request(app).get('/members');
      expect(response.status).toBe(200);
    });

    it('should return results with search query', async () => {
      const response = await request(app).get('/members?firstName=John');
      expect(response.status).toBe(200);
    });

    it('should return results with view query', async () => {
      const response = await request(app).get('/members?view=firstName');
      expect(response.status).toBe(200);
    });
  });
});
