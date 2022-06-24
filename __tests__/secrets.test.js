const UserService = require ('../lib/services/UserService');
const pool = require ('../lib/utils/pool');
const app = require('../lib/app');
const request = require('supertest');
const setup = require('../data/setup');
const Secret = require('../lib/models/Secrets');

const mockUser = { 
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = await request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('secrets path', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('displays secrets to authenticated users', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');
    const secrets = await Secret.getAll();
    expect(res.body).toEqual(secrets);
  });
});


afterAll(() => {
  pool.end();
});

