const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ first_name, last_name, email, password }){
    const password_hash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({
      first_name,
      last_name,
      email,
      password_hash,
    });
    return user;
  }
};
