import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
        password: Sequelize.VIRTUAL, // virtual doest not persist
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeCreate', async user => {
      if (user.password) {
        const salt = 8;
        user.password_hash = await bcrypt.hash(user.password, salt);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
