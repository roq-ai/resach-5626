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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getStudentProgressById, updateStudentProgressById } from 'apiSdk/student-progresses';
import { Error } from 'components/error';
import { studentProgressValidationSchema } from 'validationSchema/student-progresses';
import { StudentProgressInterface } from 'interfaces/student-progress';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { ModuleInterface } from 'interfaces/module';
import { getUsers } from 'apiSdk/users';
import { getModules } from 'apiSdk/modules';

function StudentProgressEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<StudentProgressInterface>(
    () => (id ? `/student-progresses/${id}` : null),
    () => getStudentProgressById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: StudentProgressInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateStudentProgressById(id, values);
      mutate(updated);
      resetForm();
      router.push('/student-progresses');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<StudentProgressInterface>({
    initialValues: data,
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
            Edit Student Progress
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'student_progress',
  operation: AccessOperationEnum.UPDATE,
})(StudentProgressEditPage);
