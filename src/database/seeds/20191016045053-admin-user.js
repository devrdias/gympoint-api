const bcrypt = require('bcryptjs');

// TODO: change hash secret
module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Administrator',
          email: 'admin@gympoint.com',
          password_hash: bcrypt.hashSync('123456', 8),
          is_admin: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
