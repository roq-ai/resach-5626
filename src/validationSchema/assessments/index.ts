import * as yup from 'yup';

export const assessmentValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  module_id: yup.string().nullable(),
  teaching_assistant_id: yup.string().nullable(),
});
