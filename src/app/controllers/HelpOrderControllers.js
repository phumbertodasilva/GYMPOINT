import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderControllers {
  async index(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Invalid help order!' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: id,
      },
    });

    return res.json(helpOrders);
  }

  async create(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Invalid help order!' });
    }

    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { question } = req.body;

    const helpOrders = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrderControllers();
