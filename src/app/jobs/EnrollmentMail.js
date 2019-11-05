import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment } = data;

    console.log('A fila executor');

    await Mail.sendMail({
      to: `${enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Matricula realizada',
      template: 'enrollment',
      context: {
        student: enrollment.student.name,
        plan: enrollment.plan.title,
        duration: enrollment.plan.duration,
        start_date: format(
          parseISO(enrollment.start_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(enrollment.end_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        price: enrollment.price,
      },
    });
  }
}

export default new EnrollmentMail();
