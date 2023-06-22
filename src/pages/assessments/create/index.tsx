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
import { createAssessment } from 'apiSdk/assessments';
import { Error } from 'components/error';
import { assessmentValidationSchema } from 'validationSchema/assessments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ModuleInterface } from 'interfaces/module';
import { UserInterface } from 'interfaces/user';
import { getModules } from 'apiSdk/modules';
import { getUsers } from 'apiSdk/users';
import { AssessmentInterface } from 'interfaces/assessment';

function AssessmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AssessmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAssessment(values);
      resetForm();
      router.push('/assessments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AssessmentInterface>({
    initialValues: {
      title: '',
      description: '',
      module_id: (router.query.module_id as string) ?? null,
      teaching_assistant_id: (router.query.teaching_assistant_id as string) ?? null,
    },
    validationSchema: assessmentValidationSchema,
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
            Create Assessment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
            <FormLabel>Title</FormLabel>
            <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
            {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
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
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'teaching_assistant_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
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
  entity: 'assessment',
  operation: AccessOperationEnum.CREATE,
})(AssessmentCreatePage);
