const pool = require ('../utils/pool');

module.exports = class User {
  id;
  first_name;
  last_name;
  email;
  #password_hash;

  constructor(row) {
    this.id = row.id;
    this.first_name = row.first_name;
    this.last_name = row.last_name;
    this.email = row.email;
    this.#password_hash = row.password_hash;
  }
  static async insert({ first_name, last_name, email, password_hash }) {
    const { rows } = await pool.query(
      `INSERT into user (first_name, last_name, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [first_name, last_name, email, password_hash]
    );
    return new User(rows[0]);
  }

  get passwordHash(){
    return this.#password_hash;
  }
};
