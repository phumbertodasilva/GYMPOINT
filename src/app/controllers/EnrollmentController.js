import * as Yup from 'yup';
import { startOfHour, parseISO, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll();

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student not found!' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found!' });
    }

    const startDate = startOfHour(parseISO(start_date));

    const endDate = addMonths(startDate, plan.duration);
    const price = plan.price * plan.duration;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      price,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment not found!' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student not found!' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found!' });
    }

    const startDate = startOfHour(parseISO(start_date));

    const endDate = addMonths(startDate, plan.duration);
    const price = plan.price * plan.duration;

    await enrollment.update({
      student_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      price,
    });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment not found!' });
    }

    await enrollment.destroy();

    return res.json();
  }
}

export default new EnrollmentController();
