import * as yup from 'yup';
import { practicePlanValidationSchema } from 'validationSchema/practice-plans';

export const coachValidationSchema = yup.object().shape({
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  user_id: yup.string().nullable().required(),
  team_id: yup.string().nullable().required(),
  practice_plan: yup.array().of(practicePlanValidationSchema),
});
