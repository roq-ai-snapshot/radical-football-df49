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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getPerformanceById, updatePerformanceById } from 'apiSdk/performances';
import { Error } from 'components/error';
import { performanceValidationSchema } from 'validationSchema/performances';
import { PerformanceInterface } from 'interfaces/performance';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { PracticePlanInterface } from 'interfaces/practice-plan';
import { getPlayers } from 'apiSdk/players';
import { getPracticePlans } from 'apiSdk/practice-plans';

function PerformanceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PerformanceInterface>(
    () => (id ? `/performances/${id}` : null),
    () => getPerformanceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PerformanceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePerformanceById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PerformanceInterface>({
    initialValues: data,
    validationSchema: performanceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Performance
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="rating" mb="4" isInvalid={!!formik.errors?.rating}>
              <FormLabel>rating</FormLabel>
              <NumberInput
                name="rating"
                value={formik.values?.rating}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.rating && <FormErrorMessage>{formik.errors?.rating}</FormErrorMessage>}
            </FormControl>
            <FormControl id="feedback" mb="4" isInvalid={!!formik.errors?.feedback}>
              <FormLabel>feedback</FormLabel>
              <Input type="text" name="feedback" value={formik.values?.feedback} onChange={formik.handleChange} />
              {formik.errors.feedback && <FormErrorMessage>{formik.errors?.feedback}</FormErrorMessage>}
            </FormControl>
            <FormControl id="created_at" mb="4">
              <FormLabel>created_at</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.created_at}
                onChange={(value: Date) => formik.setFieldValue('created_at', value)}
              />
            </FormControl>
            <FormControl id="updated_at" mb="4">
              <FormLabel>updated_at</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.updated_at}
                onChange={(value: Date) => formik.setFieldValue('updated_at', value)}
              />
            </FormControl>
            <AsyncSelect<PlayerInterface>
              formik={formik}
              name={'player_id'}
              label={'player_id'}
              placeholder={'Select Player'}
              fetcher={getPlayers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.user_id}
                </option>
              )}
            />
            <AsyncSelect<PracticePlanInterface>
              formik={formik}
              name={'practice_plan_id'}
              label={'practice_plan_id'}
              placeholder={'Select Practice Plan'}
              fetcher={getPracticePlans}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.title}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
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
  entity: 'performance',
  operation: AccessOperationEnum.UPDATE,
})(PerformanceEditPage);
