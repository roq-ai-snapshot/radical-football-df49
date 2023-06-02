import * as yup from 'yup';

export const performanceValidationSchema = yup.object().shape({
  rating: yup.number().integer().required(),
  feedback: yup.string(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  player_id: yup.string().nullable().required(),
  practice_plan_id: yup.string().nullable().required(),
});
