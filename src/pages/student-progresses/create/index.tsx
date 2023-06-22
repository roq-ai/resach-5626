import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createStudentProgress } from 'apiSdk/student-progresses';
import { Error } from 'components/error';
import { studentProgressValidationSchema } from 'validationSchema/student-progresses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { ModuleInterface } from 'interfaces/module';
import { getUsers } from 'apiSdk/users';
import { getModules } from 'apiSdk/modules';
import { StudentProgressInterface } from 'interfaces/student-progress';

function StudentProgressCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: StudentProgressInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createStudentProgress(values);
      resetForm();
      router.push('/student-progresses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<StudentProgressInterface>({
    initialValues: {
      progress: 0,
      student_id: (router.query.student_id as string) ?? null,
      module_id: (router.query.module_id as string) ?? null,
    },
    validationSchema: studentProgressValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Student Progress
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="progress" mb="4" isInvalid={!!formik.errors?.progress}>
            <FormLabel>Progress</FormLabel>
            <NumberInput
              name="progress"
              value={formik.values?.progress}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('progress', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.progress && <FormErrorMessage>{formik.errors?.progress}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'student_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<ModuleInterface>
            formik={formik}
            name={'module_id'}
            label={'Select Module'}
            placeholder={'Select Module'}
            fetcher={getModules}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'student_progress',
  operation: AccessOperationEnum.CREATE,
})(StudentProgressCreatePage);
