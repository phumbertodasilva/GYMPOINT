import { startOfDay, endOfDay, subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Invalid enrollment!' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Invalid enrollment!' });
    }

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json({ error: 'Student not found!' });
    }

    const parsedDate = Number(new Date());
    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [
            startOfDay(subDays(parsedDate, 7)),
            endOfDay(parsedDate),
          ],
        },
      },
    });

    if (checkins.length > 5) {
      return res
        .status(401)
        .json({ error: 'Only 5 checkins allowed every 7 days!' });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });
    return res.json(checkin);
  }
}

export default new CheckinController();
