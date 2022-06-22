const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = { 
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  password: '123456'
};

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;
//   const agent = request.agent(app);
//   const user = await UserService.create({ ...mockUser, ...userProps });
//   const { email } = user;
//   await agent.post('/api/v1/users/sessions').send ({ email, password });
//   return [agent, user];
// };

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new user', async() => {
    const res = request(app).post('/api/v1/users').send(mockUser);
    const { first_name, last_name, email } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      first_name,
      last_name,
      email,
    });
  });
  afterAll(() => {
    pool.end();
  });
});
