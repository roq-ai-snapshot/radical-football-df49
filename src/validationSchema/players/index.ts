import * as yup from 'yup';
import { attendanceValidationSchema } from 'validationSchema/attendances';
import { performanceValidationSchema } from 'validationSchema/performances';

export const playerValidationSchema = yup.object().shape({
  position: yup.string(),
  birth_date: yup.date(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  user_id: yup.string().nullable().required(),
  team_id: yup.string().nullable().required(),
  attendance: yup.array().of(attendanceValidationSchema),
  performance: yup.array().of(performanceValidationSchema),
});
