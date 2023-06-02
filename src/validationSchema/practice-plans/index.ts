import * as yup from 'yup';
import { attendanceValidationSchema } from 'validationSchema/attendances';
import { performanceValidationSchema } from 'validationSchema/performances';

export const practicePlanValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  date: yup.date().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  coach_id: yup.string().nullable().required(),
  team_id: yup.string().nullable().required(),
  attendance: yup.array().of(attendanceValidationSchema),
  performance: yup.array().of(performanceValidationSchema),
});
