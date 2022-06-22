const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = { 
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  pasword: '123456'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.pasword;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send ({ email, password });
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new user', async() => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@exmaple.com', password: '123456' });

    expect(res.status).toEqual(200);
  });
  afterAll(() => {
    pool.end();
  });
});
