import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import HelpOrderMail from '../jobs/HelpOrderMail';

class AnswerController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Invalid help order!' });
    }

    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    const helpOrderAnswer = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(HelpOrderMail.key, {
      helpOrder: helpOrderAnswer,
    });

    return res.json(helpOrderAnswer);
  }
}

export default new AnswerController();
