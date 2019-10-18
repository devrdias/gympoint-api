import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // does not persist virtual data
        password_hash: Sequelize.STRING,
        birth: Sequelize.DATE,
        weight: Sequelize.STRING,
        height: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeCreate', async student => {
      if (student.password) {
        const salt = 8;
        student.password_hash = await bcrypt.hash(student.password, salt);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Student;
