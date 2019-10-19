import Mail from '../../libs/Mail';

class HelpAnsweredMail {
  get key() {
    return 'HelpAnsweredMail';
  }

  async handle({ data }) {
    const {
      help: {
        question,
        answer,
        student: { name, email },
      },
      user,
    } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'You have an answer from Gym Point!',
      template: 'helpOrderAnswered',
      context: {
        name,
        question,
        answer,
        user: user.name,
        image: `${process.env.APP_URL}/files/logo.png`,
      },
    });
  }
}

export default new HelpAnsweredMail();
