import * as yup from 'yup';

export const studentProgressValidationSchema = yup.object().shape({
  progress: yup.number().integer().required(),
  student_id: yup.string().nullable(),
  module_id: yup.string().nullable(),
});
