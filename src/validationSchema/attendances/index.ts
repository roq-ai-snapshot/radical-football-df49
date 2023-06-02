import * as yup from 'yup';

export const attendanceValidationSchema = yup.object().shape({
  attended: yup.boolean().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  player_id: yup.string().nullable().required(),
  practice_plan_id: yup.string().nullable().required(),
});
