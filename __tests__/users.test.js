const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = { 
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send ({ email, password });
  return [agent, user];
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new user', async() => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { firstName, lastName, email } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });
  it('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '123456' });
    expect(res.status).toEqual(200);
  });
  it('/protected should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/users/secrets');
    expect(res.status).toEqual(401);
  });

  it('signs an existing user out', async () => {
    const [agent] = await registerAndLogin();
    await agent.delete('/api/v1/secrets');
    const res = await request(app).get('/api/v1/secrets');
    expect(res.body.status).toEqual(401);
  });

  
  // TODO testing successful and unsuccessful route for authenticated 
  afterAll(() => {
    pool.end();
  });
});
