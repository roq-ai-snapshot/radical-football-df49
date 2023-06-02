import * as yup from 'yup';
import { coachValidationSchema } from 'validationSchema/coaches';
import { playerValidationSchema } from 'validationSchema/players';
import { practicePlanValidationSchema } from 'validationSchema/practice-plans';

export const teamValidationSchema = yup.object().shape({
  name: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  academy_id: yup.string().nullable().required(),
  coach: yup.array().of(coachValidationSchema),
  player: yup.array().of(playerValidationSchema),
  practice_plan: yup.array().of(practicePlanValidationSchema),
});
