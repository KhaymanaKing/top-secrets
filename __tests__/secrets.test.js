const { Router } = require('express');
const UserService = require('../services/UserService');
const pool = require ('../utils/pool');
const mockUser = require('../mocks/user');
const app = require('../lib/app');
const request = require('supertest')(app);
const setup = require('../data/setup');

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? 'password';
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/users').send({ email, password });
  return [agent, user];
};

describe('secrets path'), () => {
  beforeEach(() => {
    return setup(pool);
  });
};
it('displays secrets to authenticated users', async () => {
  const [agent, user] = await registerAndLogin();
  const res = await agent.get('aapi/v1/secrets');
  expect(res.body).toEqual(200);
});


afterAll(() => {
  pool.end();
});

