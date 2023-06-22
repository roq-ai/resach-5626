import * as yup from 'yup';

export const moduleValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  course_id: yup.string().nullable(),
});
