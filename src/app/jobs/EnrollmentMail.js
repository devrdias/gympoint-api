import enUS from 'date-fns/locale/en-US';
import { format, parseISO } from 'date-fns';
import Mail from '../../libs/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const {
      enrollment: { start_date, end_date },
      student: { name, email },
      title,
      duration,
      price,
    } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Welcome to Gym Point!',
      template: 'enrollmentConfirmation',
      context: {
        name,
        title,
        duration,
        start_date: format(parseISO(start_date), 'yyyy-MM-dd', {
          locale: enUS,
        }),
        end_date: format(parseISO(end_date), 'yyyy-MM-dd', {
          locale: enUS,
        }),
        price,
        image: `${process.env.APP_URL}/files/logo.png`,
      },
    });
  }
}

export default new EnrollmentMail();
